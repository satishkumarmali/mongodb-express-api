'use strict';

const config = require('../config/config')
const mongoose = require('mongoose');

async function connect() {
    // Set variable according to config file environment
    const host = config.DB_HOST;
    const db = config.DB_NAME;
    const port = config.DB_PORT;
    const user = config.DB_USER;
    const pass = config.DB_PASSWORD;
    //mongodb connection
   return mongoose.connect(`mongodb://${user}:${pass}@${host}:${port}/${db}`, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(
        (connection) => {
            console.log(`Connected to MongoDB : ${db}`)
        },
        err => {
            console.log(err);
        }
    );
}

module.exports = {
    connect
};