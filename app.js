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
app.use(express.urlencoded({ extended: true }))
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
const userRoutes = require('./routes/users');
const Category = require('./models/question').Category;
const { Question } = require('./models/question');
const { User } = require('./models/user');


app.use('/users', userRoutes);
app.use('/categories', categoryRoutes);
app.use('/questions', questionRoutes);

// GET /populated-categories
// Route for categories collection
app.get('/populated-categories', async (req, res, next) => {
  Category.find({}, null, async (err, categories) => {
    
    if (err) return next(err);
    req.payload = {};
    categories.map((category, categoriesIndex) => {
      Category.findOne({_id: category._id})
      .populate({ 
        path: 'questions',
        model: Question,
        options: { sort: { 'difficulty': 1, 'createdAt': -1 } }
      }).exec((err, questions) => {
        if (err) return next(event);
        req.payload[category.slug] = questions;
        if (Object.keys(req.payload).length === categories.length) {
          // We've populated all the categories
          res.status(201);
          res.json(req.payload);
        }
      });
    });
  });
});

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

const port = process.env.PORT || 8080;

app.listen(port, console.log(`Express server listening on port ${port}`));
