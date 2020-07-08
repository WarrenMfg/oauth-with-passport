const express = require('express');
const passport = require('passport');
const authRoutes = require('./routes/auth-routes');
const connect = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

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
  module.exports.db = await connect();
  require('./config/passport-setup');
  app.listen(PORT, () => console.log(`OAuth listening on port ${PORT}`));
})();
