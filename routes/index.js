var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
require('dotenv').config();
const passport = require('passport');
const secretkey = process.env.secretkey;
const ClientURL = process.env.CLient_URL


var passportsetUP = require('../config/passport');


router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] })
);


router.get('/auth/google/callback',
passport.authenticate('google', { successRedirect:`${ClientURL}/socialprofile`, failureRedirect: '/login/failed' }),
  function(req, res) {
    res.redirect('/login/success');
  }
  );


router.get('/auth/github',
  passport.authenticate('github', { scope: ['profile','email'] })
);


router.get('/auth/github/callback',
passport.authenticate('github', { successRedirect:`${ClientURL}/socialprofile`, failureRedirect: '/login/failed' }),
  function(req, res) {
    res.redirect('/login/success');
  }
  );



router.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['profile','email'] })
);


router.get('/auth/facebook/callback',
passport.authenticate('facebook', { successRedirect:`${ClientURL}/socialprofile`, failureRedirect: '/login/failed' }),
  function(req, res) {
    res.redirect('/login/success');
  }
  );


router.get("/login/success", (req, res) => {
  if (req.user) {
    res.send({
      statusCode: 200, user: req.user, cookies: req.cookies,
      message: "Google Signin Successfull"
    });
  } else {
    res.send({ statusCode: 400, message: "User not found in session" });
  }
})

router.get("/login/failed", (req, res) => {
  res.send({ statusCode: 400, message: "Google Signin Failed !" });
})

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(ClientURL);
})



module.exports = router;
