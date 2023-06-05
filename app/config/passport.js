const JwtStrategy = require('passport-jwt').Strategy;
const {
    ExtractJwt
} = require('passport-jwt');
const {
    jwtSecret
} = require('./constants');

const jwtOptions = {
    secretOrKey: jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
};

const jwtUser = async (payload, done) => {
    try {
        return done(null, payload);
    } catch (error) {
        return done(error, false);
    }
};

exports.jwtUser = new JwtStrategy(jwtOptions, jwtUser);