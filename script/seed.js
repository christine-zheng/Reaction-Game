'use strict';

const {
  db,
  models: { User, Game },
} = require('../server/db');

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */

async function seed() {
  await db.sync({ force: true }); // clears db and matches models to tables
  console.log('db synced!');

  // Creating Users
  const usersArr = [
    User.create({ username: 'test', password: '123' }),
    User.create({ username: 'zzz', password: '123' }),
  ];

  const users = await Promise.all(usersArr);

  console.log(`seeded ${users.length} users`);

  // Games
  const gamesArr = [
    Game.create({
      result: [0.396, 0.361, 0.329, 0.323, 0.326, 0.293, 0.321],
      bestTime: 0.293,
      avgTime: 0.336,
    }),
    Game.create({
      result: [0.234, 0.345, 0.33, 0.199, 0.387, 0.513, 0.287],
      bestTime: 0.199,
      avgTime: 0.328,
    }),
  ];

  const games = await Promise.all(gamesArr);

  console.log(`seeded ${games.length} games`);

  // associate with some users
  // assumes # of orders <= # of users
  for (let i = 0; i < games.length; i++) {
    await games[i].setUser(users[i]);
  }

  // for testing
  return {
    users: {
      test: users[0],
      zzz: users[1],
    },
  };
}

/*
 We've separated the `seed` function from the `runSeed` function.
 This way we can isolate the error handling and exit trapping.
 The `seed` function is concerned only with modifying the database.
*/
async function runSeed() {
  console.log('seeding...');
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log('closing db connection');
    await db.close();
    console.log('db connection closed');
  }
}

/*
  Execute the `seed` function, IF we ran this module directly (`node seed`).
  `Async` functions always return a promise, so we can use `catch` to handle
  any errors that might occur inside of `seed`.
*/
if (module === require.main) {
  runSeed();
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
