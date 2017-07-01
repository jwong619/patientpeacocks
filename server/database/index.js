const pg = require('pg-promise')();

const connection = {
  host: 'localhost',
  port: '',
  database: 'events_app',
  user: 'postgres',
  password: 'meow2meow'
}

const db = pg(connection);

module.exports = db;


// db.query('select * from users').then((result)=> {
//   console.log(result);
// })
// })
