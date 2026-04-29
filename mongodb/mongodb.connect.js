const mongoose = require('mongoose');

const DEFAULT_MONGODB_URI = 'mongodb://127.0.0.1:27017/todo-tdd';

const connectToMongo = async () => {
  const mongoUri = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;

  return mongoose.connect(mongoUri);
};

module.exports = connectToMongo;
