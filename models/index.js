const Question = require('./question').Question;
const Category = require('./question').Category;
const User = require('./user').User;

const models = { Question, Category, User };
 
module.exports.models = models;