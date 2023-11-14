const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const apiCall = require('./apiCall');
const bodyParser = require('body-parser');

var num= 0;

//express app
const app = express();

//connect to mongoDB
const dbURI = 'mongodb+srv://al3xcurtis42:Sitrucxela@cluster0.huimoh5.mongodb.net/app2-database?retryWrites=true&w=majority';
mongoose.connect(dbURI).then ( (result) => console.log('connected to mongoDB') ).catch((err) => console.log(err));

//register view engine,  app.set('views', 'example folder'); just in case
app.set('view engine', 'ejs');


//listen for requests
app.listen(1337); 

//middleware and static files
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); 




app.use(morgan('dev'));

//mongoose and mongo sandbox
app.get('/add-blog', (req,res) => {
    const blog = new Blog({
        title: 'new blog',
        snippet: 'about my new blog',
        body: 'more about my new blog'
    });
    blog.save().then( (result) => {
        res.send(result)
    })
    .catch((err) => {
        console.log(err);
    })
});

app.get('/all-blogs', (req,res) => {
    Blog.find().then((result) => {
        res.send(result);
    })
    .catch( (err) => console.log(err));
});






app.get('/', (req,res) => {

  res.render('index', {title: 'home'});
});



app.post('/post', (req, res) => {
  data = apiCall.runApiCall(req.body.userInput);
  console.log('Here is the data object for lyric count' + data);
  
  res.render('lyricsPage', {title: 'lyrics', data})
  
   // res.redirect('/lyrics');
});

 




app.get('/about', (req,res) => {
    res.render('about', {title: 'About'});
});



//404
app.use((req,res) => {
    res.status(404).render('404', {title: '404'});
});




// api call
