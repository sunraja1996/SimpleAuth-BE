const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
require('dotenv').config();
const { usersModel } = require('../schema/UsersSchema')


  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },

      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await usersModel.findOne({ googleId: profile.id });
          if (!user) {
            user = await usersModel.create({
              googleId: profile.id,
              displayName: profile.displayName,
              email: profile.emails[0].value
            });
          }
          return done(null, user,profile);
          
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );


  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: '/auth/github/callback',
      },

      async (accessToken, refreshToken, profile, done) => {
        try {
          if (profile && profile.emails && profile.emails.length > 0){
          let user = await usersModel.findOne({ githubId: profile.id });
          
          if (!user) {
            user = await usersModel.create({
              githubId: profile.id,
              displayName: profile.displayName,
              email: profile.emails[0].value
            });
          }
        }
          return done(null,profile);
          
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );


  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: '/auth/facebook/callback',
      },

      async (accessToken, refreshToken, profile, done) => {
        try {
          if (profile && profile.emails && profile.emails.length > 0){
          let user = await usersModel.findOne({ facebookIdId: profile.id });
          
          if (!user) {
            user = await usersModel.create({
              facebookId: profile.id,
              displayName: profile.displayName,
              email: profile.emails[0].value
            });
          }
        }
          return done(null,profile);
          
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    console.log("User data:", user);
    done(null, user);
  });


  module.exports = passport