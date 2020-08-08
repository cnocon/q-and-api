const express = require('express');
const router = express.Router();
const Question = require('../models/question').Question;
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
  const question = await new Question({_id: shortid.generate(), ...req.body});
  question.save(err => {
    if (err) return next(err);
    res.status(201);
    res.json(question);
  });
});

// POST /:qID/categories
// Route for creating categories on a question
router.post('/:qID/categories', async (req, res, next) => {
  req.body.forEach(c => req.question.categories.push(c));
  req.question.save(err => {
    if (err) return next(err);
    res.status(201);
    res.json(req.question.categories);
  });
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
