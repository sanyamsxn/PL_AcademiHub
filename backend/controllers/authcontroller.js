const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const user = require('../models/user');
const { createToken } = require('../util/jwttoken')

exports.login = async(req,res) =>{
    try{
        const { email , password} =  req.body;
        const user1 = await user.findOne({email});
        
        if(!user1){
          return res.json({ message: 'User not found ', success: false });
        }
        const valid = await bcrypt.compare(password , user1.password);
        if(!valid){
          return res.json({ message: 'Incorrect password ', success: false });
        }
        const token = createToken(user1.id);
        const userObj = user1.toObject();
        delete userObj.password;
        
        res.status(201).json({ message: 'Signin successful', success: true, token:token, user:userObj });

    }
    catch (err){
      res.status(500).json({ message: 'Signin failed: ', success: false })      
    }
}



//SIGNUP ROUTES:
exports.signup = async (req, res) => {
    try {
      const { name, email, stream, password, confirmPassword, year } = req.body;
      if (password !== confirmPassword) {
        return res.json({ message: 'Password do not match ', success: false });
      }
      const user1 = new user({ name, email, password, stream, year });
      await user1.save();
      return res.status(201).json({ message: 'Signup successful', success: true });
    } catch (err) {
      if (err.name === 'ValidationError') {
        // Extract error messages
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ message: messages.join(', '), success: false });
      }
      if(err.code === 11000){
        return res.status(400).json({message:'user already exists with this mail, try diff', success:false});
      }
      res.status(500).json({ message: 'Signup failed: ', success: false });
    }
  };