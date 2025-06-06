require("dotenv").config()

const express = require('express');
const path = require('path');
const ejs = require('ejs')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')

mongoose.connect(process.env.MONGO_URL)
.then((e)=> console.log("MongoDB Connected"))

const Blog = require('./models/blog')

const userRoute = require('./routes/user')
const blogRoute = require('./routes/blog')

const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const app = express();
const PORT = process.env.PORT || 8000;

app.set("view engine","ejs")
app.set("views", path.resolve( "views"));

//middleware
app.use(cors({
    origin: 'http://localhost:3000', // React app URL
    credentials: true
}))
app.use(express.json()) // Add JSON parsing for API routes
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve('./public')))

app.get('/',async(req,res)=>{
    const allBlogs = await Blog.find({});
    return res.render('home',{
        user: req.user,
        blogs: allBlogs
    });
})

app.use('/user',userRoute)
// If any request start with /user then use `userRoute`
app.use('/blog',blogRoute)

// API routes for React frontend
app.use('/api/user', userRoute)
app.use('/api/blog', blogRoute)

// API endpoint to get all blogs
app.get('/api/blogs', async(req, res) => {
    try {
        const allBlogs = await Blog.find({}).populate('createdBy', 'fullName profileImageURL').sort({ createdAt: -1 });
        res.json({
            success: true,
            blogs: allBlogs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching blogs',
            error: error.message
        });
    }
})

// API endpoint to get current user
app.get('/api/me', (req, res) => {
    if (req.user) {
        res.json({
            success: true,
            user: req.user
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Not authenticated'
        });
    }
})




app.listen(PORT , ()=>console.log(`Server started at PORT:${PORT}`));

