const Sequelize = require('sequelize');
const db = require('../db');

// reaction times will be in seconds (typically 2-3 decimal places)
const Game = db.define('game', {
  result: {
    type: Sequelize.ARRAY(Sequelize.DECIMAL(4, 3)),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  bestTime: {
    type: Sequelize.DECIMAL(4, 3),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  avgTime: {
    type: Sequelize.DECIMAL(4, 3),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

module.exports = Game;
