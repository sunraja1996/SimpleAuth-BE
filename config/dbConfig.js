const mongoose = require('mongoose')
require('dotenv').config();

const dbUrl = process.env.DB_URL;

module.exports ={dbUrl,mongoose}