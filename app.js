'use strict';
const uri = process.env.MONGODB_URI;

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

const app = express();

const jsonParser = require('body-parser').json;
const logger = require('morgan');

app.use(logger('dev'));
app.use(jsonParser());
// When adding user registrations I'll ask for their domains to whitelist
// https://www.npmjs.com/package/cors
app.use(cors());

mongoose.connect(uri, {
  useNewUrlParser: true, 
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', err => console.error("connection error:", err));
db.once("open", () => console.log('db connection successful'));

const questionRoutes = require('./routes/questions');
const categoryRoutes = require('./routes/categories');

app.use('/categories', categoryRoutes);
app.use('/questions', questionRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Custom error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: { message: err.message }
  })
});

const port = process.env.PORT || 3000;

app.listen(port, console.log(`Express server listening on port ${port}`));
