const express = require('express');
const router = express.Router();
const User = require('../models/user').User;

// Register a user
router.post('/register', (req, res, next) => {
  const { name, username, email, password, password_confirmation} = req.body;
  
  if (name && username && email && password && password_confirmation) {
    if (password !== password_confirmation) {
      const err = new Error('Passwords must match.');
      err.status = 400;
      return next(err);
    } else {
      const userData = {
        name: name,
        email: email,
        username: username,
        password: password
      }
      User.create(userData, (err, user) => {
        if (err) {
          return next(err);
        } else {
          return res.redirect('https://fed-flash-cards.netlify.app/');
        }
      })
    }
  } else {
    const err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
  
  
})

// Login a user
router.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  if (email && password) {
    User.authenticate(email, password, function (error, user) {
      if (error || !user) {
        const err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        res.status(201);
        res.json(user);
      }
    });
  } else {
    const err = new Error('Email and password are required');
    err.status = 401;
    return next(err);
  }
});



module.exports = router;