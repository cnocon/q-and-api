'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = require('shortid');

const QuestionSchema = new Schema({
  _id: { type: String, default: shortid.generate },
  prompt: String,
  categories: { type: Array, default: [] },
  difficulty: Number,
  gist: String,
  snippet: String,
  createdAt: { type: Date, default: Date.now },
  answer: String
});

const Question = mongoose.model("Question", QuestionSchema);

module.exports.Question = Question;