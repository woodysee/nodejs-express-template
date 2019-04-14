// console.info('Declaring dependencies...');
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const flash = require("connect-flash");

const app = express();

// console.info('Initialising request body parser for the server app...');
// console.info('Extended is set as true to allow browser to stay authenticated as opposed to just with Postman. Source: https://stackoverflow.com/questions/46628069/passport-local-strategy-working-in-postman-but-not-in-browser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require("./storage/logger")(app, morgan);

app.use(require("cookie-parser")());
app.use(
  require("express-session")({
    cookie: {
      maxAge: 60000
    },
    secret: process.env.USERS__PASSPORT_EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false // false means that unless you are hitting a page that is giving you a cookie & session you won't be getting a cookie or session.
  })
);
app.use(flash());

// console.info('Connecting to web client...');
// app.use(express.static(__dirname + "/../client/build"));

// console.info('Initialising server-side view rendering...');
require("./views")(app);

// console.info("Initialising passport...");
require("./resources/users/lib/passport.local")(app);
// console.info("Initialising passport local strategy...");

// console.info('Loading resources...');
app.use("/users", require("./resources/users"));
app.use("/tasks", require("./resources/generic"));

/*
 **
 ** Add new resources here
 **
 */

// console.info('...loaded resources.');

app.listen(process.env.SERVER__APP__PORT, () => {
  console.info(
    "server/app.js: express.js server app is now running locally on port: " +
      process.env.SERVER__APP__PORT
  );
});
