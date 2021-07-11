const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const resultSchema = new Schema({
  pin: {
    type: String,
    required: true,
    default: "",
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  score: {
    type: String,
    required: true,
  },
  correct : [{
    correct_answer : String,
    selected_answer : String,
    question: String,
  }],
  in_correct: [{
    correct_answer : String,
    selected_answer : String,
    question: String,
  }]
});

const result = mongoose.model("Result", resultSchema);

module.exports = result;
