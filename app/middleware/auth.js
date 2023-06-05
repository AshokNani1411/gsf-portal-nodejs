const httpStatus = require('http-status');
const passport = require('passport');

const APIError = require('./../utils/APIError');

const handleJWT = (req, res, next) => async (err, user, info) => {
    const error = err || info;
    const apiError = new APIError({
        message: error ? error.message : 'Unauthorized',
        status: httpStatus.UNAUTHORIZED,
        stack: error ? error.stack : undefined,
    });

    if (error) {
        return next(apiError);
    }

    req.user = {
        ...user,
        id: user._id
    };
    return next();
};

exports.authorize = () => (req, res, next) =>
    passport.authenticate(
        'jwt-user', {
            session: false
        },
        handleJWT(req, res, next),
    )(req, res, next);