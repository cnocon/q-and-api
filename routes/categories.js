const express = require('express');
const router = express.Router();
const Category = require('../models/question').Category;
const { Question } = require('../models/question');
// populates an array of objects
// User.find(match, function (err, users) {
//   var opts = [{ path: 'company', match: { x: 1 }, select: 'name' }];

//   var promise = User.populate(users, opts);
//   promise.then(console.log).end();
// })


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


// GET /categories
// Route for categories collection
router.get('/', async (req, res, next) => {

  if (req.query.property) {
    const property = req.query.property;
    Category.find({}, property, (err, categories) => {
      if (err) return next(err);
      res.json(categories);
    });
  } else {
    Category.find({}, null, (err, categories) => {
      if (err) return next(err);
      res.json(categories);
    });
  }
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

// GET /categories/:cID
// View a single category
router.get('/:cID', async (req, res, next) => {
  res.json(req.category);
});

// POST to /categories route
// Create a master category
router.post('/', (req, res, next) => {
  const cat = new Category(req.body);
  cat.save(err => {
    if (err) return next(err);
    res.status(201);
    res.json(cat);
  });
});

// POST /:cID/questions/:qID
// Expects an array of question identifiers
// Route for adding questions to a master category
router.post('/:cID/questions/:qID', async (req, res, next) => {
  const question = await Question.findOne({_id: req.params.qID});
  req.category.questions.push(question);
  req.category.save(async err => {
    if (err) return next(err);
    res.status(201);
    res.json(req.category);
  });
});

module.exports = router;