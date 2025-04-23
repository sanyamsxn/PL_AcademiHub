const express =  require("express");
authrouter =  express.Router();
const authController = require('../controllers/authcontroller');
const authMiddleware = require('../middlewares/authmiddleware');
// authrouter.get("/", (req,res)=> {
//     res.render('login');
// });
// authrouter.get('/signup',(req,res)=>{
//     res.render('signup');

// })
authrouter.post("/signin", authController.login)
authrouter.post("/signup",authController.signup);


module.exports = authrouter;