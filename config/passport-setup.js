const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { ObjectId } = require('mongodb');

module.exports = db => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await db.collection('users').findOne({ _id: ObjectId.createFromHexString(id) });
      done(null, user);
    } catch (err) {
      console.log(err.message, err.stack);
    }
  });

  passport.use(
    new GoogleStrategy(
      {
        // options for strategy
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.NODE_ENV === 'production'
          ? process.env.HOST_PROD
          : process.env.HOST_DEV}/auth/google/redirect`
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await db.collection('users').findOne({ googleId: profile.id });
          if (!user) {
            const newUser = await db.collection('users').insertOne({
              googleId: profile.id,
              username: profile.displayName,
              avatar: profile._json.picture
            });
            done(null, newUser);
          } else {
            done(null, user);
          }
        } catch (err) {
          console.log(err.message, err.stack);
        }
      }
    )
  );
};
