
const mongoose=require('mongoose');
const validator=require('validator');
const jwt=require('jsonwebtoken');
const _=require('lodash');
const bcrypt=require('bcryptjs');


var UsersSchema=new mongoose.Schema({
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
    var user=this;
    var userObject=user.toObject();

    return _.pick(userObject,['_id','email']);
}


UsersSchema.methods.generateAuthToken=function(){

    var user=this;
    var access='auth';
    var token=jwt.sign({_id:user._id.toHexString(),access},'abc123').toString();
    user.tokens=user.tokens.concat([{access,token}]);

    return user.save().then(()=>{
        return token;
    });
};

UsersSchema.statics.findByToken=function(token){
    var User=this;
    var decoded;
    try{
      decoded=jwt.verify(token,'abc123');
    }catch(e){
       return Promise.reject();
    }

    return User.findOne({
        '_id':decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'
    });
};

//saving data before update

UsersSchema.pre('save',function(next){
    var user=this;

    if(user.isModified){

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
