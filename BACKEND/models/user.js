const mongoose  =  require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true
    },
    profilepic:{
        type:String,
    }
});

userSchema.plugin(passportLocalMongoose)

const User = mongoose.model("User",userSchema);

module.exports = User;