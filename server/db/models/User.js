const Sequelize = require('sequelize');
const db = require('../db');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = db.define('user', {
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

// instance methods
User.prototype.correctPassword = async function (candidatePassword) {
  // should return true or false for if the entered password matches
  const match = await bcrypt.compare(candidatePassword, this.password);
  return match;
};

User.prototype.generateToken = function () {
  // should sign a JWT token from an environment variable
  const token = jwt.sign({ id: this.id }, process.env.JWT);
  return token;
};

// class methods
User.authenticate = async function ({ username, password }) {
  // this should find a user with the given username and determine if the password is valid for them
  const user = await User.findOne({
    where: {
      username,
    },
  });

  // if user does not exist or password is incorrect
  if (!user || !user.correctPassword(password)) {
    const err = new Error('Incorrect username or password');
    err.status = 401;
    throw err;
  }
  // if credentials are correct, generate token for user
  return user.generateToken();
};

User.findByToken = async function (token) {
  // verify the id on the token and find the corresponding user, otherwise throw an error

  try {
    // get the user id of this token
    const { id } = jwt.verify(token, process.env.JWT);

    // find user. if user exists, return user
    const user = await User.findByPk(id);
    if (user) return user;

    // else bad credentials
    const err = new Error('Bad credentials.');
    err.status = 401;
    throw err;
  } catch (error) {
    const err = new Error('Bad token.');
    err.status = 401;
    throw err;
  }
};

// HOOKS
const hashPassword = async (user) => {
  //in case the password has been changed, we want to encrypt it with bcrypt
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, saltRounds);
  }
};

User.beforeCreate(hashPassword);
User.beforeUpdate(hashPassword);

module.exports = User;
