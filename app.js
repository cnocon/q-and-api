'use strict';

const express = require('express');

const connectDb = require('./models').connectDb;
const app = express();

connectDb();

const routes = require('./routes');

const jsonParser = require('body-parser').json;
const logger = require('morgan');

app.use(logger('dev'));
app.use(jsonParser());

const mongoose = require('mongoose');

// db.on('error', err => console.error("connection error:", err));
// db.once("open", () => console.log('db connection successful'));

// // Configure pre-flight CORS 
// app.use((req, res, next) => {
//   // Any domain can make requests to this API
//   res.header('Access-Control-Allow-Origin', '*');
//   // Accepteable request headers
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   if (req.method = "OPTIONS") {
//     res.header('Access-Control-Allow-Methods', 'PUT,POST,DELETE');
//     return res.status(200).json({});
//   }
//   next();
// });

app.use('/questions', routes);

// // catch 404 and forward to error handler
// app.use((req, res, next) => {
//   const err = new Error("Not Found");
//   err.status = 404;
//   next(err);
// });

// // Custom error handler
// app.use((err, req, res, next) => {
//   res.status(err.status || 500);
//   res.json({
//     error: { message: err.message }
//   })
// });

const port = process.env.PORT || 3000;

app.listen(port, console.log(`Express server listening on port ${port}`));
