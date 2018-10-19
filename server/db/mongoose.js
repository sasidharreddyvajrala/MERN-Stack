
var mongoose = require('mongoose');

mongoose.Promise=global.Promise;
let db={
    localhost:'mongodb://localhost:27017/TodoApp',
    mlab:'mongodb://sasidharvajrala:Divine@5@ds235243.mlab.com:35243/todoapp'
}
mongoose.connect(db.localhost || db.mlab);


module.exports={mongoose};