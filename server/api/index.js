const router = require('express').Router();

// matches all requests to /api/games
router.use('/games', require('./games'));

// matches all requests to  /api/puppies/
// router.use('/puppies', require('./puppies'));

// // matches all requests to  /api/kittens/
// router.use('/kittens', require('./kittens'));

// for non-existing /api routes
router.use((req, res, next) => {
  const err = new Error('API route not found.');
  err.status = 404;
  next(err);
});

module.exports = router;
