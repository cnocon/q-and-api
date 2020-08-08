const express = require('express');
const router = express.Router();
const Category = require('../models/question').Category;
const shortid = require('shortid');
const { Question } = require('../models/question');

// Callback  to execute when cID is present
router.param('cID', function(req, res, next, id) {
  Category.findById(id, (err, category) => {
    if (err) return next(err);
    if (!category) {
      const error = new Error(`Category with ID ${id} not found`);
      error.status = 404;
      return next(error);
    }
    req.category = category;
    next();
  });
});

// GET /categories/:cID/questions
// View all questions for a category
router.get('/:cID/questions', async (req, res, next) => {
  Category
    .findOne({_id: req.params.cID})
    .populate({ 
      path: 'questions', 
      model: Question
    }).exec((err, questions) => {
      if (err) return next(event);
      res.status(201);
      res.json(questions);
    });
});

// POST to /categories route
// Create a master category
router.post('/', (req, res, next) => {
  const cat = new Category({_id: shortid.generate(), ...req.body});
  cat.save(err => {
    if (err) return next(err);
    res.status(201);
    res.json(cat);
  });
});

// POST /categories/:qID
// Route for adding questions to a master category
router.post('/:cID/questions', (req, res, next) => {
  req.body.forEach(q_id => req.category.questions.push(q_id));
  req.category.save(err => {
    if (err) return next(err);
    res.status(201);
    res.json(req.category);
  });
});

module.exports = router;