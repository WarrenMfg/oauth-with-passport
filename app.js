const express = require('express');
const passport = require('passport');
const passportSetup = require('./config/passport-setup');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const connect = require('./db');
const cookieSession = require('cookie-session');
const { COOKIE_KEY } = require('./config/config');

const app = express();
const PORT = process.env.PORT || 3000;
let db;

// set view engine
app.set('views', './views');
app.set('view engine', 'ejs');

// middleware
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [ COOKIE_KEY ]
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

// create home route
app.get('/', (req, res) => {
  res.render('home', { user: req.user });
});

(async () => {
  db = await connect();
  passportSetup(db);
  app.listen(PORT, () => console.log(`OAuth listening on port ${PORT}`));
})();
