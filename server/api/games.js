const router = require('express').Router();
const {
  models: { User, Game },
} = require('../db');

// MIDDLEWARE FUNCTION TO CHECK FOR AUTH HEADERS and attach user to req
const requireToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const user = await User.findByToken(token);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// GET: /api/games/ -- will used for rankings later
router.get('/', (req, res, next) => {
  res.send('/api/games -- hello, rankings coming soon!');
});

// GET: /api/games/userStats -- get user's (all) games results
router.get('/userStats', requireToken, async (req, res, next) => {
  try {
    // const stats = await req.user.getGames();
    const stats = await Game.findAll({
      where: {
        userId: req.user.id,
      },
      order: [['updatedAt', 'DESC']],
    });
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

// POST: /api/games/userStats -- add game results for current user
router.post('/userStats', requireToken, async (req, res, next) => {
  try {
    if (req.user) {
      const newGame = await Game.create(req.body);
      const results = await newGame.setUser(req.user.id);

      res.json(results);
    }
  } catch (error) {
    next(error);
  }
});

// GET: /api/games/leaderboard
router.get('/leaderboard', requireToken, async (req, res, next) => {
  try {
    const stats = await Game.findAll({
      attributes: ['id', 'avgTime'],
      include: {
        model: User,
        attributes: ['username'],
      },
      order: [['avgTime', 'ASC']],
      limit: 15,
    });
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
