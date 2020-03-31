const express = require("express");
const passport = require("passport");
const cors = require("cors");
require("../services/google-passport")(passport);
const {checkToken} = require('../services/token-validator.js');

const authRouter = express.Router();
authRouter.use(cors({ origin: true, credentials: true }));
authRouter.use(checkToken);

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
  }

const routes = function routes() {
  
//home route function    
authRouter.route('/').get(function(req,res){
    res.render('index', { user: req.user });
});
    

// accessing the account
authRouter.route('/account').get(ensureAuthenticated, function(req,res){
    res.render('account', { user: req.user });
})

//login route
authRouter.route('/login').get(function(req,res){
    res.render('login', { user: req.user });
})

//auth google route
authRouter.route('/auth/google').get(passport.authenticate('google',{scope:['email','profile'],accessType: 'offline'}));

// callback route
authRouter.route('/auth/google/callback').get(passport.authenticate('google',{
    successRedirect: '/',
    failureRedirect: '/login'
}));

//logout route
authRouter.route('/logout').get(function(req,res){
    req.logout();
    res.redirect('/');
});

  return authRouter;
};

module.exports = routes;
