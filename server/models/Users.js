
const mongoose=require('mongoose');
const validator=require('validator');
const jwt=require('jsonwebtoken');
const _=require('lodash');
const bcrypt=require('bcryptjs');


const UsersSchema=new mongoose.Schema({
        email:{
            type:String,
            required:true,
            trim:true,
            minlength:1,
            unique:true,
            validator:(value)=validator.isEmail,
            message:'{value} is not a valid email'
        },
        password:{
            type:String,
            require:true,
            minlength:6
         },
         tokens:[{
             access:{
                 type:String,
                 required:true
               },
            token:{
                type:String,
                required:true
            }
         }]
});

UsersSchema.methods.toJSON=function(){
    const user=this;
    const userObject=user.toObject();

    return _.pick(userObject,['_id','email']);
}

//Generateing Token
UsersSchema.methods.generateAuthToken=function(){

    const user=this;
    const access='auth';
    const token=jwt.sign({_id:user._id.toHexString(),access},process.env.JWT_SECRECT).toString();
    user.tokens=user.tokens.concat([{access,token}]);

    return user.save().then(()=>{
        return token;
    });
};

//Finding User credantials
UsersSchema.statics.findByCredentials=function(email,password){
    const User=this;

    return User.findOne({email}).then((user)=>{
        if(!user){
            return Promise.reject();
        }
        return new Promise((resolve,reject)=>{
             bcrypt.compare(password,user.password,(err,res)=>{
                 if(res){
                    resolve(user);
                 }else{
                     reject();
                 }
            });
        }); 
    });
};


//Finding user by token
UsersSchema.statics.findByToken=function(token){
    var User=this;
    var decoded;
    try{
      decoded=jwt.verify(token,process.env.JWT_SECRECT);
    }catch(e){
       return Promise.reject();
    }

    return User.findOne({
        '_id':decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'
    });
};

UsersSchema.methods.removeToken=function(token){
    var user=this;

    return user.update({
        $pull:{
            tokens:{token}
        }
    });
}

//saving data before update

UsersSchema.pre('save',function(next){
    var user=this;

    if(user.isModified('password')){

        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password=hash;
                next();
            })
        });   
    }
    else{
        next();
    }
});

var Users=mongoose.model('Users',UsersSchema);

module.exports={Users};
