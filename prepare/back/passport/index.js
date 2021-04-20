const passport = require('passport');
const local = require('./local');

// passport index = app.js (중앙 통제실)
module.exports = () => {
  passport.serializeUser(() => {});

  passport.deserializeUser(() => {});

  local();
};
