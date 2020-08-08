'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = require('shortid');

const CategorySchema = new Schema({
  _id: { type: String, default: shortid.generate },
  name: String,
  slug: String,
  questions: { type: Array, ref: 'Question', default: [] }
});

const QuestionSchema = new Schema({
  _id: { type: String, default: shortid.generate },
  prompt: String,
  prompt_media: Array,
  answer: String,
  answer_media: Array,
  difficulty: Number,
  categories: [CategorySchema],
  createdAt: { type: Date, default: Date.now }
});

const Question = mongoose.model("Question", QuestionSchema);
const Category = mongoose.model("Category", CategorySchema);

module.exports.Category = Category;
module.exports.Question = Question;