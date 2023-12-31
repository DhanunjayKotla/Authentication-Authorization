const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });

const app = require('./app')

mongoose
    .connect(process.env.DATABASE)
    .then(() => console.log('connected to database'))
    .catch(err => console.log('failed to connect to database', err.message))

const server = app.listen('3000', () => {
    console.log('listening...');
})
