const {Router} = require('express');
const User = require('../models/user')
const router = Router();

router.get('/signin',(req,res)=>{
    return res.render("signin")
})
router.get('/signup',(req,res)=>{
    return res.render("signup");
})
router.post('/signup',async (req,res)=>{
    const {fullName , password , email } = req.body;
    try {
        await User.create({
            fullName,
            email,
            password
        });

        // Check if this is an API request
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.json({
                success: true,
                message: 'User registered successfully'
            });
        }

        // Otherwise redirect for EJS
        return res.redirect('/');
    } catch (error) {
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.status(400).json({
                success: false,
                message: 'Registration failed',
                error: error.message
            });
        }
        return res.redirect('/user/signup');
    }
})

router.post('/signin',async(req,res)=>{
    const { password , email  } = req.body;
    try {
        const token =await User.matchPasswordAndGenerateToken(email,password);
        console.log("Token",token);

        // Check if this is an API request
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.cookie('token',token).json({
                success: true,
                message: 'Login successful'
            });
        }

        // Otherwise redirect for EJS
        return res.cookie('token',token).redirect('/');
    } catch (error) {
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.status(401).json({
                success: false,
                error: "Incorrect Email or Password"
            });
        }
        return res.render('signin',{
            error:"Incorrect Email or Password",
        });
    }
})

router.get('/logout',(req, res)=>{
    // Check if this is an API request
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.clearCookie('token').json({
            success: true,
            message: 'Logged out successfully'
        });
    }

    // Otherwise redirect for EJS
    res.clearCookie('token').redirect('/');
})
module.exports=router;
