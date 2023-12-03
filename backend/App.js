const express = require('express');
const ErrorHandler = require('./utils/ErrorHandler');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static('uploads'));
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());

// config 
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// routes
const user = require('./controller/user');
app.use('/api/v2/user', user);

app.use(ErrorHandler);

module.exports = app;