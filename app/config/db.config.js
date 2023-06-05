const {
  DBHOST,
  DBUSER,
  DBPASSWORD,
  DBNAME,
  DBPORT
} = require('./constants');

module.exports = {
  HOST: DBHOST,
  USER: DBUSER,
  PASSWORD: DBPASSWORD,
  DB: DBNAME,
  PORT: DBPORT
};