const pgp = require('pg-promise')();

pgs.defaults.ssl = true;

const connection = {
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'meow2meow'
}

const db = pgp(process.env.DATABASE_URL || connection);
module.exports = db;


