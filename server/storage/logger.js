const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');
const logDirectory = path.join(__dirname, 'logs');

module.exports = (app, morgan) => {

  // console.log("Ensuring that the logs directory exists...");
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

  // console.log("Creating a rotating write stream...");
  const accessLogStream = rfs('requests.log', {
    interval: '1d', // New log file daily
    path: logDirectory
  });

  // // console.log("Using nodemon logger...");
  // app.use(morgan("combined"));

  // console.log("Setting up the logger...");
  app.use(morgan('combined', {
    stream: accessLogStream
  }));

}