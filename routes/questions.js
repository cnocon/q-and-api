const express = require('express');
const { Category } = require('../models/question');
const router = express.Router();
const Question = require('../models/question').Question;

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
  Question.find({}, null, {sort: { difficulty: 1, createdAt: -1 } }, (err, questions) => {
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
  const question = new Question(req.body);
  if (req.body.tags && req.body.tags.length > 0) {
    req.body.tags.forEach(tag => {
      const cat = Category.find({name: tag});
      if (cat.length) {
        cat.questions.length ? cat.questions.push(...question) : cat.update({questions: [...question]});
        cat.save((err, doc) => {
          if (err) return next(err);
        });
      }
    });
  }

  await question.save(err => {
    if (err) return next(err);
    res.status(201);
    res.json(question);
  });
});

// POST /:qID/tags
// Route for creating tags on a question
router.post('/:qID/tags', async (req, res, next) => {
  req.body.forEach(c => req.question.tags.push(c));
  req.question.save(err => {
    if (err) return next(err);
    res.status(201);
    res.json(req.question.tags);
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
