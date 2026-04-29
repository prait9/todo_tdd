const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    done: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.models.Todo || mongoose.model('Todo', todoSchema);
