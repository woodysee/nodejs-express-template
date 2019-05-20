import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import rfs from 'rotating-file-stream';
const logDirectory = join(__dirname, 'logs');

export const initialiseLogger = (app, morgan) => {
  // console.log("Ensuring that the logs directory exists...");
  existsSync(logDirectory) || mkdirSync(logDirectory);

  // console.log("Creating a rotating write stream...");
  const accessLogStream = rfs('requests.log', {
    interval: '1d', // New log file daily
    path: logDirectory,
  });

  // console.log("Setting up the logger...");
  const format = 'combined'; // Possible pre-defined formats: combined, common, dev, short, tiny
  const options = {
    stream: accessLogStream,
  };
  app.use(morgan(format, options));
};

// Reference: https://github.com/expressjs/morgan
