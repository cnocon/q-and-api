const uri = process.env.MONGODB_URI;
const mongoose = require('mongoose');
const Question = require('./question').Question;
 
const connectDb = () => {
  return mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true});
};
 
const models = { Question };
 
module.exports = { connectDb };
 
module.exports.models = models;