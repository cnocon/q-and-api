const express = require('express');
const router = express.Router();
const User = require('../models/user').User;

// Callback  to execute when qID is present
router.param('userID', function(req, res, next, id) {
  User.findById(id, (err, user) => {
    if (err) return next(err);
    if (!user) {
      const error = new Error(`user with ID ${id} not found`);
      error.status = 404;
      return next(error);
    }
    req.user = user;
    next();
  });
});

// GET /users
// Route for questions collection
router.get('/', (req, res, next) => {
  User.find({}, null, {sort: { username: 1 } }, (err, users) => {
    if (err) return next(err);
    res.json(users);
  });
});


// GET /users/:userID
// Route for a specific question
router.get('/:userID', (req, res) => {
  // We set up middleware to load question onto req object when qID is a param (line 8)
  res.json(req.user);
});


// GET a user
router.get('/:id', (req, res, next) => {

})


module.exports = router;