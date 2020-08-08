'use strict';

const express = require('express');
const router = express.Router();
const Question = require('./models/question').Question;
const Category = require('./models/question').Category;
const shortid = require('shortid');

// Callback  to execute when qID is present
router.param('qID', function(req, res, next, id) {
  Question.findById(id, (err, question) => {
    if (err) return next(err);
    if (!question) {
      const error = new Error(`Question with ID ${id} not found`);
      error.status = 404;
      return next(error);
    }
    req.question = question;
    next();
  });
});

// GET /questions
// Route for questions collection
router.get('/', (req, res, next) => {
  Question.find({}, null, {sort: {createdAt: -1}}, (err, questions) => {
    if (err) return next(err);
    res.json(questions);
  });
});

// GET /questions/:qID
// Route for a specific question
router.get('/:qID', (req, res) => {
  // We set up middleware to load question onto req object when qID is a param (line 8)
  res.json(req.question);
});

// POST /questions
// Route for creating questions
router.post('/', async (req, res, next) => {
  const question = await new Question(req.body);
  question.categories.forEach(cat => {
    Category.findOneAndUpdate(
      { name: cat.name  },
      { $setOnInsert: { _id: cat._id || shortid.generate() } },
      {
        returnOriginal: false,
        upsert: true,
        useFindAndModify: false
      }, (err, doc) => {
        question.save((err, doc) => {
          if (err) return next(err);
          res.status(201);
          res.json(doc);
        });
      }
    );
    
  });

  

  // question.save(async (err, q) => {
  //   if (err) return next(err);

  //   await Category.create(q.categories, (error, cat) => {
  //     if (error) return next(error);

  //     res.status(201);
  //     res.json(q);
  //   });

    // question.categories.forEach(category => {
    //   const found = Category.findById(category._id);
      
    //   if (!found) {
    //     Category.findOneAndUpdate(
    //       { _id: category._id || shortid.generate() },
    //       { $setOnInsert: { name: category.name }},
    //       {
    //         returnOriginal: false,
    //         upsert: true,
    //         useFindAndModify: false
    //       }
    //     );
    //   }
    // });
  // });
});

// POST /:qID/categories
// Route for creating categories on a question
router.post('/:qID/categories', async (req, res, next) => {
  const category = await Category.findOneAndUpdate(
    { name: req.body.name },
    { $setOnInsert: { name: req.body.name }},
    {
      returnOriginal: false,
      upsert: true,
      useFindAndModify: false
    }
  );
  const newOrUpdated = category.value;
  res.json(newOrUpdated);
});


// PUT questions/:qID
// Edit a specific question
router.put('/:qID/', (req, res, next) => {
  req.question.update(req.body, (err, question) => {
    if (err) return next(err);
    res.json(question);
  });
});

// DELETE /questions/:qID
// Delete a specific answer
router.delete('/:qID', (req, res, next) => {
  req.question.remove((err, question) => {
    if (err) return next(err);
    res.send("Successfully deleted");
  });
});

// POST /questions/:qID/vote-up
// POST /questions/:qID/vote-down
// Vote on a specific answer
router.post('/:qID/vote-:dir',
(req, res, next) => {
  if (req.params.dir.search(/^(up|down)$/) === -1) {
    const err = new Error("Invalid vote direction parameter");
    err.status = 404;
    next(err);
  } else {
    req.vote = req.params.dir;
    next();
  }
}, 
(req, res, next) => {
  req.question.vote(req.vote, (err, question) => {
    if (err) return next(err);
    res.json(question);
  });
});

module.exports = router;