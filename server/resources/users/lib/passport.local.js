// Adapted from Jared Hanson https://github.com/passport/express-4.x-local-example/blob/master/server.js
// console.info('Declaring dependencies...');
require("dotenv").config();

const bcrypt = require("bcrypt");
const passport = require("passport");
const Strategy = require("passport-local").Strategy;
require("../../../db/mongo")("for user authentication.");
const User = require("../model");
let response = {};

module.exports = (app) => {
  // Use application-level middleware for common functionality, including
  // logging, parsing, and session handling.

  // Initialize Passport and restore authentication state, if any, from the
  // session.
  app.use(passport.initialize());
  app.use(passport.session()); // express-session must be initialised first

  // Configure the local strategy for use by Passport.
  //
  // The local strategy require a `verify` function which receives the credentials
  // (`username` and `password`) submitted by the user.  The function must verify
  // that the password is correct and then invoke `cb` with a user object, which
  // will be set at `req.user` in route handlers after authentication.
  passport.use(new Strategy({
    usernameField: "alias",
    passwordField: "password",
    passReqToCallback: true,
    session: false
  }, function(req, alias, password, cb) {
    // console.log("Query from client: alias - ", alias);
    // console.log("Query from client: password - ", password);
    User.findOne({ 'name.alias': alias }, async (err, user) => {
      if (err) {
        return cb(err);
      }
      // console.log("authenticatedUser:", user);
      if (!user.name.alias) {
        console.error("Invalid user.");
        const error = {
          id: response.errors.length,
          status: "400",
          code: "error__invalid_user",
          title: "Error",
          detail: `No such user with alias ${user.name.alias}.`
        };
        response.errors.push(error);
        return cb(null, false, response);
      }

      const hash = user.password.hash;

      const passwordsMatch = await new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (err, hash) => {
          if (err) reject(err);
          resolve(hash);
        });
      });

      console.log("passwordsMatch:", passwordsMatch);

      if (user.password.hash != hash) {
        console.error("Invalid password.");
        console.log("Hashes don't match:", user.password.hash, "!==", hash);
        response.errors = [];
        const error = {
          id: response.errors.length,
          status: "400",
          code: "error__wrong_pw",
          title: "Error",
          detail: `Password submitted does not match.`
        };
        response.errors.push(error);
        return cb(null, false, response);
      }
      console.log("Passwords match:", user.password.hash, "===", hash);
      return cb(null, user);
    });
  }));

  // Configure Passport authenticated session persistence.
  //
  // In order to restore authentication state across HTTP requests, Passport needs
  // to serialize users into and deserialize users out of the session.  The
  // typical implementation of this is as simple as supplying the user ID when
  // serializing, and querying the user record by ID from the database when
  // deserializing.
  passport.serializeUser(function(user, cb) {
    console.log("User serialised:", user.name.alias);
    cb(null, user.name.alias);
  });

  passport.deserializeUser(function(alias, cb) {
    console.log("User deserialised:", alias);
    User.findOne({ "name.alias": alias }, function(err, user) {
      if (err) {
        return cb(err);
      }
      cb(null, user);
    });
  });

  return {
    app: app,
    passport: passport
  };

}