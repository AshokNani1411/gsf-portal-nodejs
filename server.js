const express = require("express");
const error = require('./app/middleware/error');
const strategies = require('./app/config/passport');
const path = require('path');
const contentDisposition = require('content-disposition');
const passport = require('passport');
const {
  port,
  env
} = require('./app/config/constants');
const app = express();
const cors = require('cors');

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({
  extended: true
}));

app.use(cors());

const apiRoutes = require('./app/routes/index');
app.use('/api', apiRoutes);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// enable authentication
app.use(passport.initialize());
passport.use('jwt-user', strategies.jwtUser);

app.use((req, res) => {
  res.status(404).send({
    url: '404 not found.'
  })
});

// set port, listen for requests
app.listen(port || 3000, () => {
  console.log(`Server is running on port ${port} ${env}.`);
});