const ejs = require('ejs');
const express = require('express');

module.exports = (app) => {
  
  const resources = [
    "users", "generic"
  ]; // <-- You can add more resource-specific views by adding in here

  let locations = [];
  for (i in resources) {
    locations.push(`${__dirname}/resources/${resources[i]}/views`);
  }

  // console.log("Initialising the single view from the single page application...");
  locations.push(`${__dirname}/../client`);

  let ejsOptions = {delimiter: '?'};
  app.set("views", locations);
  app.use('/', express.static(`${__dirname}/../client`)); // Single Page Application
  // Reference: https://stackoverflow.com/questions/43261318/node-js-express-how-do-i-render-a-file-that-is-inside-views-subfolder
  app.set("view engine", "ejs");
  app.engine('html', (path, data, cb) => {
    ejs.renderFile(path, data, ejsOptions, cb);
  });
  // Reference: https://github.com/mde/ejs/wiki/Using-EJS-with-Express

  return app;
}