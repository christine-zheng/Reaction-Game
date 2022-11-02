const router = require('express').Router();
const {
  models: { User },
} = require('../db');

// POST: /auth/login
router.post('/login', async (req, res, next) => {
  try {
    // if username & password is valid, send token
    res.send({ token: await User.authenticate(req.body) });
  } catch (error) {
    // login/authentication failed
    next(error);
  }
});

// POST: /auth/signup
router.post('/signup', async (req, res, next) => {
  try {
    // create the user
    const newUser = await User.create(req.body);

    // generate token for the new user for this session
    res.send({ token: await newUser.generateToken() });
  } catch (error) {
    // if user creation failed
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('Sorry, this username already exists');
    } else {
      next(error);
    }
  }
});

// GET: /auth/user
router.get('/user', async (req, res, next) => {
  try {
    // get user by the token in the request header
    const token = req.headers.authorization;
    const user = await User.findByToken(token);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
