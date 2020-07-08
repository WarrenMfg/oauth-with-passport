const express = require('express');
const passport = require('passport');
const passportSetup = require('./config/passport-setup');
const authRoutes = require('./routes/auth-routes');
const connect = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
let db;

// set view engine
app.set('views', './views');
app.set('view engine', 'ejs');

// middleware
app.use(passport.initialize());
app.use('/auth', authRoutes);

// create home route
app.get('/', (req, res) => {
  res.render('home');
});

(async () => {
  db = await connect();
  passportSetup(db);
  app.listen(PORT, () => console.log(`OAuth listening on port ${PORT}`));
})();
