require('dotenv').config(); // read .env file

const express = require('express');
const mongoose = require('mongoose');
const mongoString = process.env.MONGODB_URL // db connection string
const router = require('./app/routes/router'); // get service router

//database connection
mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

// define express app
const app = express();
app.use(express.json());

// endpoints base
app.use('/api', router);

const port = process.env.PORT || 3000; //select port

// start server
app.listen(port, () => {
    console.log(`Server Started at ${port}`)
})