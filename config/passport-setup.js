const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
if (!process.env.NODE_ENV) {
  var { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, HOST } = require('./config');
}
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
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${HOST}/auth/google/redirect`
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
