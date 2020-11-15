const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  prompt: String,
  prompt_media: Array,
  answer: String,
  answer_media: Array,
  difficulty: Number,
  tags: Array,
  category_slug: String,
  createdAt: { type: Date, default: Date.now }
});

const CategorySchema = new Schema({
  name: String,
  slug: String,
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question'}]
});

const Question = mongoose.model("Question", QuestionSchema);
const Category = mongoose.model("Category", CategorySchema);

module.exports.Category = Category;
module.exports.Question = Question;