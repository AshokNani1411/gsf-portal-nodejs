const sql = require('mssql')
const util = require('util');
const dbConfig = require("../config/db.config.js");
var poolConnection = util.promisify(sql.connect)({
  server: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  port: Number(dbConfig.PORT),
  options: {
    ecrypt: true,
    trustedconnection: true,
    enableArithAbort: true,
    instancename: 'SQLEXPRESS'
  },
});

module.exports = poolConnection;