// Adapted from Jared Hanson https://github.com/passport/express-4.x-local-example/blob/master/server.js
// console.info('Declaring dependencies...');
require('dotenv').config();
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { initialiseMongoConnection } from '../../../db/mongo';
import { configurePassportAuth } from './passport.mongo';
import User from '../model';

initialiseMongoConnection('for user authentication.');

export const configureLocalPassportStrategy = app => {
  // Use application-level middleware for common functionality, including
  // logging, parsing, and session handling.

  // passport.initialize Passport and restore authentication state, if any, from the
  // session.
  app.use(passport.initialize());
  app.use(passport.session()); // express-session must be initialised first

  // Configure the local strategy for use by Passport.
  //
  // The local strategy require a `verify` function which receives the credentials
  // (`username` and `password`) submitted by the user.  The function must verify
  // that the password is correct and then invoke `done` with a user object, which
  // will be set at `req.user` in route handlers after authentication.

  // To prevent to the "verify callback" approach described in the Passport.js Documentation which requires two instances of the same strategy and supporting routes, the strategy's passReqToCallback option is set to true so that req will be passed as the first argument to the verify callback. With req passed as an argument, the verify callback can use the state of the request to tailor the authentication process, handling both authentication and authorisation using a single strategy instance and set of routes. For example, if a user is already logged in, the newly "connected" account can be associated. Any additional application-specific properties set on req, including req.session, can be used as well. Reference: http://www.passportjs.org/docs/downloads/html/

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'alias',
        passwordField: 'password',
        passReqToCallback: true,
        session: false,
      },
      function(req, alias, password, done) {
        // console.info(`Invoked local user authentication strategy using Passport.js.`)
        // console.warn(`(Debug) Receiving ${req.url}`);
        // console.log("(Debug) Query from client: alias - ", alias);
        // console.log("(Debug) Query from client: password - ", password);

        User.findOne(
          { 'name.alias': alias },
          async (err, user) => await configurePassportAuth(err, user, { password, done })
        );
      }
    )
  );

  // Configure Passport authenticated session persistence.
  //
  // In order to restore authentication state across HTTP requests, Passport needs
  // to serialize users into and deserialize users out of the session.  The
  // typical implementation of this is as simple as supplying the user ID when
  // serializing, and querying the user record by ID from the database when
  // deserializing.
  //
  // Understanding serialize and deserialize better: https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize
  passport.serializeUser(function(user, cb) {
    // console.log("User serialised:", user.name.alias);
    // console.log("Saving user.name.alias to req.session.passport.user = {name: {alias: '...'}}");
    cb(null, user.name.alias);
  });

  passport.deserializeUser(function(alias, cb) {
    // console.log("Querying database with alias:", alias);
    User.findOne({ 'name.alias': alias }, function(err, user) {
      if (err) {
        // console.log("Unable to find user to deserialise user.");
        return cb(err);
      }
      // console.log(
      //   "Attaching user object to the Express request as req.user..."
      // );
      cb(null, user);
    });
  });

  return {
    app: app,
    passport: passport,
  };
};
