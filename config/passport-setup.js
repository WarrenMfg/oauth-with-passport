const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = require('./config');

module.exports = () =>
  passport.use(
    new GoogleStrategy(
      {
        // options for strategy
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: 'auth/google/redirect'
      },
      (accessToken, refreshToken, profile, next) => {
        User.findOrCreate({ googleId: profile.id }, function(err, user) {
          return next(err, user);
        });
      }
    )
  );
