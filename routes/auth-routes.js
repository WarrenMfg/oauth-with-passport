const router = require('express').Router();
const passport = require('passport');

// login page
router.get('/login', (req, res) => {
  res.render('login', { user: req.user });
});

// logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// google
router.get('/google', passport.authenticate('google', { scope: [ 'profile' ] }));

// google callback/redirect
router.get('/google/redirect', passport.authenticate('google', { failureRedirect: '/auth/login' }), (req, res) => {
  // Successful authentication, redirect home.
  res.redirect('/profile');
});

module.exports = router;
