const db = require('./db');
const User = require('./models/User');
const Game = require('./models/Game');

// associations go here
User.hasMany(Game);
Game.belongsTo(User);

module.exports = {
  db,
  models: {
    User,
    Game,
  },
};
