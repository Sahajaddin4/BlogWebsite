const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
//const lodash=require('lodash/string');
const lodash = require('lodash/string');

const mongoose = require('mongoose');

//DataBase connection
mongoose.set('strictQuery', false);


const connectionParams = {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true
}

mongoose.connect('mongodb+srv://admin-Saha:liH5cDlyMVRJAo6D@cluster0.re6gsc2.mongodb.net/BlogDB?retryWrites=true&w=majority', connectionParams).then(() => {
    console.log("Database connection successful");
}).catch(err=>{
    console.log(err);
});



//Create schema
const blogSchema = mongoose.Schema({
    title:
    {
        type: String,
        required: true
    },
    postBody:
    {
        type: String,
        required: true
    }
});



//Create Model
const blogPost = mongoose.model('blogPost', blogSchema);



//Page default content
const homeStartingContent = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
const aboutContent = "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution";
const contactContent = "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.";





//Initialize express
const app = express();

//Make ejs file usuable
app.set('view engine', 'ejs');

//Make CSS file and other static file usable
app.use(express.static('public'));

//Body Parser  setting
app.use(bodyParser.urlencoded({ extended: true }));


//handle get requests


//Home page
app.get('/', (req, res) => {
    //Fetch datas from database
    blogPost.find({}, (err, allBlogPosts) => {
        if (!err) {
            res.render('home', { homeStartingContent: homeStartingContent, newBlog: allBlogPosts });
        }
    })

});


//About Page
app.get('/about', (req, res) => {
    res.render('about', { aboutContent: aboutContent });
});


//Contact page
app.get('/contact', (req, res) => {
    res.render('contact', { contactContent: contactContent });
});


//Compose page
app.get('/compose', (req, res) => {
    res.render('compose');
});


//get data
app.post('/compose', (req, res) => {
    const newBlogPost = new blogPost({
        title: lodash.lowerCase(req.body.title),
        postBody: req.body.post
    });
    try {
        newBlogPost.save();
        res.redirect('/');
    } catch (error) {
        console.log(error);
    }

});


//Routing 
app.get('/posts/:requestedTitle', (req, res) => {
    let requestedTitle = lodash.lowerCase(req.params.requestedTitle);
    blogPost.findOne({ title: requestedTitle }, (err, foundPost) => {
        if (!err) {
            res.render('post', { blog: foundPost });
        }
    });



});


//Port define
app.listen(process.env.PORT ||3000 , () => {
    console.log('Server is running at port 3000....');
});