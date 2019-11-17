const mongoose = require('mongoose');
// 实例一个模型
const Schema = mongoose.Schema;
// Schema 实例一个对象
const IdeaSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})
mongoose.model('ideas', IdeaSchema);