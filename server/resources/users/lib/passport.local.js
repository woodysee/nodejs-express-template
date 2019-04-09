// Adapted from Jared Hanson https://github.com/passport/express-4.x-local-example/blob/master/server.js
// console.info('Declaring dependencies...');
require("dotenv").config();
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
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

  // To prevent to the "verify callback" approach described in the Passport.js Documentation which requires two instances of the same strategy and supporting routes, the strategy's passReqToCallback option is set to true so that req will be passed as the first argument to the verify callback. With req passed as an argument, the verify callback can use the state of the request to tailor the authentication process, handling both authentication and authorisation using a single strategy instance and set of routes. For example, if a user is already logged in, the newly "connected" account can be associated. Any additional application-specific properties set on req, including req.session, can be used as well. Reference: http://www.passportjs.org/docs/downloads/html/

  passport.use(new LocalStrategy({
    usernameField: "alias",
    passwordField: "password",
    passReqToCallback: true,
    session: false
  }, function(req, alias, password, cb) {
    // console.info(`Invoked local user authentication strategy using Passport.js.`)
    // console.warn(`(Debug) Receiving ${req.url}`);
    // console.log("(Debug) Query from client: alias - ", alias);
    // console.log("(Debug) Query from client: password - ", password);
    User.findOne({ 'name.alias': alias }, async (err, user) => {
      if (err) {
        // console.error(`Error occurred while finding user in the DB:`);
        // console.error(err);
        return cb(err);
      }
      if (!user) {
        console.error(`No such user found:`);
        response.errors = [];
        const error = {
          id: response.errors.length,
          status: "400",
          code: "error__no_user",
          title: "Error",
          detail: `No user.`
        };
        response.errors.push(error);
        return cb(null, false, response);
      }

      // console.log("authenticatedUser:", user);
      
      if (!user.name.alias) {
        // console.error("Invalid user.");
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

      // console.log("Compared user-input password. Hashes match:", passwordsMatch);

      if (!passwordsMatch) {
        // console.error("Invalid password.");
        response.errors = [];
        const error = {
          id: response.errors.length,
          status: "400",
          code: "error__wrong_pw",
          title: "Error",
          detail: `Incorrect password.`
        };
        response.errors.push(error);
        return cb(null, false, response);
      }
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
    // console.log("User serialised:", user.name.alias);
    cb(null, user.name.alias);
  });

  passport.deserializeUser(function(alias, cb) {
    // console.log("User deserialised:", alias);
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