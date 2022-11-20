'use strict';

const {
  db,
  models: { User, Game },
} = require('../server/db');

const { faker } = require('@faker-js/faker');

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */

async function seed() {
  await db.sync({ force: true }); // clears db and matches models to tables
  console.log('db synced!');

  // Creating Users
  const usersArr = [
    User.create({ username: 'zzz1', password: '123' }),
    User.create({ username: 'zzz2', password: '123' }),
  ];

  Array.from({ length: 30 }).forEach(() => {
    usersArr.push(
      User.create({
        username: faker.internet.userName(),
        password: faker.internet.password(),
      })
    );
  });

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
    Game.create({
      result: [0.309, 0.379, 0.391, 0.197, 0.353, 0.281, 0.348],
      bestTime: 0.197,
      avgTime: 0.323,
    }),
    Game.create({
      result: [0.407, 0.349, 0.37, 0.348, 0.375, 0.361, 0.416],
      bestTime: 0.348,
      avgTime: 0.375,
    }),
    Game.create({
      result: [0.387, 0.368, 0.374, 0.402, 0.451, 0.352, 0.361],
      bestTime: 0.352,
      avgTime: 0.385,
    }),
    Game.create({
      result: [0.538, 0.365, 0.391, 0.431, 0.436, 0.349, 0.363],
      bestTime: 0.349,
      avgTime: 0.41,
    }),
    Game.create({
      result: [0.422, 0.338, 0.251, 0.761, 0.558, 0.487, 0.405],
      bestTime: 0.251,
      avgTime: 0.46,
    }),
    Game.create({
      result: [0.529, 0.322, 0.409, 0.392, 0.577, 0.449, 0.393],
      bestTime: 0.322,
      avgTime: 0.439,
    }),
    Game.create({
      result: [0.383, 0.447, 0.34, 0.55, 0.375, 0.366, 0.356],
      bestTime: 0.34,
      avgTime: 0.402,
    }),
    Game.create({
      result: [0.566, 0.416, 0.688, 0.502, 0.002, 0.024, 0.442],
      bestTime: 0.002,
      avgTime: 0.377,
    }),
    Game.create({
      result: [0.462, 0.405, 0.403, 0.471, 0.378, 0.132, 0.268],
      bestTime: 0.132,
      avgTime: 0.36,
    }),
    Game.create({
      result: [0.318, 0.355, 0.397, 0.368, 0.408, 0.354, 0.415],
      bestTime: 0.318,
      avgTime: 0.374,
    }),
    Game.create({
      result: [0.423, 0.376, 0.397, 0.41, 0.378, 0.379, 0.368],
      bestTime: 0.368,
      avgTime: 0.39,
    }),
    Game.create({
      result: [0.412, 0.397, 0.468, 0.369, 0.361, 0.374, 0.469],
      bestTime: 0.361,
      avgTime: 0.407,
    }),
    Game.create({
      result: [1.309, 0.39, 0.401, 0.476, 0.661, 0.487, 0.483],
      bestTime: 0.39,
      avgTime: 0.601,
    }),
    Game.create({
      result: [0.638, 0.45, 0.413, 0.388, 0.416, 0.37, 0.679],
      bestTime: 0.37,
      avgTime: 0.479,
    }),
    Game.create({
      result: [0.484, 0.431, 0.492, 0.437, 0.422, 0.525, 0.421],
      bestTime: 0.421,
      avgTime: 0.459,
    }),
    Game.create({
      result: [0.424, 0.602, 0.493, 0.434, 0.438, 0.187, 0.509],
      bestTime: 0.187,
      avgTime: 0.441,
    }),
    Game.create({
      result: [0.365, 0.368, 0.34, 0.376, 0.399, 0.417, 0.39],
      bestTime: 0.34,
      avgTime: 0.328,
    }),
    Game.create({
      result: [0.491, 0.407, 0.368, 0.42, 0.414, 0.363, 0.415],
      bestTime: 0.363,
      avgTime: 0.411,
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
      zzz1: users[0],
      zzz2: users[1],
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
