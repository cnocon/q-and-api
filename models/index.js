const uri = process.env.MONGODB_URI;
const mongoose = require('mongoose');
const Question = require('./question').Question;
const Category = require('./question').Category;
 
const connectDb = mongoose.connect(uri, {
  useNewUrlParser: true, 
  useUnifiedTopology: true
});
 
const models = { Question, Category };
 
module.exports = { connectDb };
 
module.exports.models = models;