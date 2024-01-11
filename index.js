/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");
const admin = require('firebase-admin');

const ejs = require('ejs');
const express = require('express');
const apiCall = require('./apiCall');
const bodyParser = require('body-parser');


var data;
var num= 0;

//express app
const app = express();



//register view engine,  app.set('views', 'example folder'); just in case

app.set('view engine', 'ejs');
 app.set('views', './views')

//listen for requests
 app.listen(1337); 

//middleware and static files
 app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); 



app.get('/', (req,res) => {

  res.render('index', {title: 'home'});
});

app.get('/lyrics', (req,res) => {
  //data //= apiCall.runApiCall(req.body.userInput);
  console.log("THIS IS THE DATA RIGHT BEFORE RENDERING" + data)
  res.render('lyricsPage', {title: 'lyrics', data: data})
})


app.post('/post', (req, res) => {

  data = getData(req.body.userInput);
  console.log('Here is the data object for lyric count' + data);
 // res.set('Cache-Control', 'public', 'max-age=300', 's-maxage=600');
  //res.send(`${JSON.stringify(data)}`);
  //res.sendFile( __dirname + '/views/partials/lyrics.html')
  // res.render('lyricsPage', {title: 'lyrics', data})
  
    res.redirect('/lyrics');
});

 




app.get('/about', (req,res) => {
    res.render('about', {title: 'About'});
});



//404
app.use((req,res) => {
    res.status(404).render('404', {title: '404'});
});

exports.app = functions.https.onRequest(app);


// api call
async function getData(input) {
  data = await apiCall.runApiCall(input);
  console.log("DATA from async function")
  return data;
   
}


// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
