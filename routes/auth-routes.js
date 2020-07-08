const router = require('express').Router();
const passport = require('passport');

// login page
router.get('/login', (req, res) => {
  res.render('login');
});

// logout
router.get('/logout', (req, res) => {
  // handle with passport
  res.send('logging out');
});

// google
router.get('/google', passport.authenticate('google', { scope: [ 'profile' ] }));

// google callback/redirect
router.get(
  '/google/redirect',
  passport.authenticate('google', { failureRedirect: '/auth/login', session: false }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

module.exports = router;
