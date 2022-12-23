const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const app = express();

//View engine
app.set('view engine', 'ejs');
//Static files
app.use(express.static('public'));   

// Data procesing
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//env vars
dotenv.config({path: './env/.env'});

// Cookies
app.use(cookieParser());

app.use('/', require('./routes/router.js'));

app.listen(3000, () => {
    console.log('Connected - http://localhost:3000');
});