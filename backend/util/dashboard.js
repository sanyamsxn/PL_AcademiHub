const jwt = require('../util/jwttoken')
 
const verify = (req,res,next)=>{
    const token =  req.cookies.token;
    if(!token){
        return res.redirect('/login');
    }
    try{
        const verified = jwt.verify(token,process.env.JWT_SECRET);
        req.user = verified;
        next()

    }catch (err){
       return res.redirect('login');

    }
}   
module.exports = verify;