const path = require('path');
const env = process.env.NODE_ENV || 'development';
require('dotenv-safe').config({
    path: path.join(__dirname, `./../../environments/.env.${env}`),
    sample: path.join(__dirname, './../../environments/.env.development'),
});


console.log('set to ' + process.env.NODE_ENV);

module.exports = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
    DBHOST: process.env.DBHOST,
    DBUSER: process.env.DBUSER,
    DBPASSWORD: process.env.DBPASSWORD,
    DBNAME: process.env.DBNAME,
    DBPORT: process.env.DBPORT,
};