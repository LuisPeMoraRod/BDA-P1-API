require('dotenv').config(); // read .env file
var cors = require('cors') //cross-origin middleware
const express = require('express');
const mongoose = require('mongoose');
const router = require('./app/routes/router'); // get service router
const swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger.json');

const connStrings = require('./app/helpers/conn-strings'); 

// set connection strings depending on instance number
const mongoString = connStrings.setDBUrl();
const port = connStrings.setPort();

const [replica1, replica2] = connStrings.setReplicaAPIs();
console.log(replica1);
console.log(replica2);

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