const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, HOST } = require('./config');
// const { db } = require('../app');

module.exports = db =>
  passport.use(
    new GoogleStrategy(
      {
        // options for strategy
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${HOST}/auth/google/redirect`
      },
      async (accessToken, refreshToken, profile, next) => {
        try {
          const user = await db.collection('users').findOne({ googleId: profile.id });
          if (!user) {
            const newUser = await db.collection('users').insertOne({
              googleId: profile.id,
              username: profile.displayName,
              avatar: profile._json.picture
            });
            next(null, newUser);
          } else {
            next(null, user);
          }
        } catch (err) {
          console.log(err.message, err.stack);
        }
      }
    )
  );
