const router = require('express').Router();

const isLoggedIn = (req, res, next) => {
  if (req.user) next();
  else res.redirect('/auth/login');
};

router.get('/', isLoggedIn, (req, res) => {
  res.render('profile', { user: req.user });
});

module.exports = router;
