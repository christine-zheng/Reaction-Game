const db = require('./db');
const User = require('./models/User');

// associations go here

module.exports = {
  db,
  models: {
    User,
  },
};
