// console.info('Declaring dependencies...');
require('dotenv').config();
import express from 'express';
import { urlencoded, json } from 'body-parser';
import morgan from 'morgan';
import flash from 'connect-flash';
import { initialiseViews } from './views';
import { initialiseLogger } from './storage/logger';
import { configureLocalPassportStrategy } from './resources/users/lib/passport.local';
import usersResource from './resources/users';
import genericResource from './resources/generic';

const app = express();

// console.info('Initialising request body parser for the server app...');
// console.info('Extended is set as true to allow browser to stay authenticated as opposed to just with Postman. Source: https://stackoverflow.com/questions/46628069/passport-local-strategy-working-in-postman-but-not-in-browser');
app.use(urlencoded({ extended: true }));
app.use(json());

initialiseLogger(app, morgan);

app.use(require('cookie-parser')());
app.use(
  require('express-session')({
    cookie: {
      maxAge: 60000,
    },
    secret: process.env.USERS__PASSPORT_EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // false means that unless you are hitting a page that is giving you a cookie & session you won't be getting a cookie or session.
  })
);
app.use(flash());

// console.info('Connecting to web client...');
// app.use(express.static(__dirname + "/../client/build"));

// console.info('Initialising server-side view rendering...');
initialiseViews(app);

// console.info("Initialising passport...");
// console.info("Initialising passport...");
configureLocalPassportStrategy(app);
// console.info("Initialising passport local strategy...");

// console.info('Loading resources...');
app.use('/users', usersResource);
app.use('/tasks', genericResource);

/*
 **
 ** Add new resources here
 **
 */

// console.info('...loaded resources.');

app.listen(process.env.SERVER__APP__PORT, () => {
  console.info(
    'server/build/app.js: express.js server app is now running locally on port: ' +
      process.env.SERVER__APP__PORT
  );
});
