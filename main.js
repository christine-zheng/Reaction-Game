'use strict';

const { db } = require('./server/db');
const app = require('./server');

// this can be very useful if you deploy to Heroku!
const PORT = process.env.PORT || 3000;

// if you update your db schemas, make sure you drop the tables first and then recreate them

// if you pass the force: true option to sync, that will drop all of your tables before re-creating them. Be sure to never do this in production!

// sync database
db.sync().then(() => {
  console.log('db synced');
  app.listen(PORT, () =>
    console.log(`Your server is listening on port ${PORT}`)
  );
});
