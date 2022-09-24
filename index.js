require('dotenv').config(); // read .env file
var cors = require('cors') //cross-origin middleware
const express = require('express');
const mongoose = require('mongoose');
const mongoString = process.env.MONGODB_URL // db connection string
const router = require('./app/routes/router'); // get service router
const swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger.json');

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

app.use(cors()) // accept all CORS request
app.use(express.json());

// endpoints base
app.use('/api', router);

const port = process.env.PORT || 3000; //select port

// swagger UI doc
app.use(
    '/api-docs',
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument)
  );

// start server
app.listen(port, () => {
    console.log(`Server Started at ${port}`)
})