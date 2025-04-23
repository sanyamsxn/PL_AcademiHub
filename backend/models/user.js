const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const userschema = new mongoose.Schema({
    name : {
        type: String,
        required : [true , 'username is requierd'],
        minlength: 3,

    },
    email :{
        type : String,
        required : [true , 'email is required'],
        unique : true,
        lowercase : true,
        validate : [validator.isEmail, " please provide a valid email"]
    },
    password : {
        type : String,
        required : [true, 'please provide password'],
        minlength : [9 , 'password must be at list 9 character long'],
        message: 'password must contain at least one number and one special character'
        
    },
   
   stream : {
    type : String,
    required: true,
   },
   year:{
    type:String,
    required: true
   }
    

});

userschema.pre('save',async function(next){
    if(!this.isModified('password')) {
        return next();
    }
   this.password = await bcrypt.hash(this.password, 10);
    next()    ;

})

const user  = mongoose.model('user', userschema);
module.exports = user;