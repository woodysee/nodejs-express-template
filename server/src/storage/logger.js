const fs = require("fs");
const path = require("path");
const rfs = require("rotating-file-stream");
const logDirectory = path.join(__dirname, "logs");

module.exports = (app, morgan) => {
  // console.log("Ensuring that the logs directory exists...");
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

  // console.log("Creating a rotating write stream...");
  const accessLogStream = rfs("requests.log", {
    interval: "1d", // New log file daily
    path: logDirectory
  });

  // console.log("Setting up the logger...");
  const format = "combined"; // Possible pre-defined formats: combined, common, dev, short, tiny
  const options = {
    stream: accessLogStream
  };
  app.use(morgan(format, options));
};

// Reference: https://github.com/expressjs/morgan
