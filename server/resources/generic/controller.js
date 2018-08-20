// console.info(`Initialising RESTful resources...`);
const metalog = {};
metalog.resource = {};
metalog.resource.singular = `generic resource`;
metalog.resource.plural = `generic resources`;
metalog.resource.controller = `genericController`;

exports.create = {};
exports.read = {};
exports.update = {};
exports.delete = {};

exports.create.one = (req, res, next) => {
  // console.info(`${metalog.resource.controller}.create.one(): Create a ${metalog.resource.singular}. Invoked...`);
};

exports.create.many = (req, res, next) => {
  // console.info(`${metalog.resource.controller}.create.many(): Creates ${metalog.resource.plural}. Invoked...`);
};

exports.read.one = (req, res, next) => {
  // console.info(`${metalog.resource.controller}.read.one(): Show ${metalog.resource.singular} details. Invoked...`);
};

exports.read.many = (req, res, next) => {
  // console.info(`${metalog.resource.controller}.read.many(): Show details of ${metalog.resource.plural}. Invoked...`);
};

exports.update.one = (req, res, next) => {
  // console.info(`${metalog.resource.controller}.update.one(): Update details of a ${metalog.resource.singular}. Invoked...`);
};

exports.update.many = (req, res, next) => {
  // console.info(`${metalog.resource.controller}.update.many(): Update info of many ${metalog.resource.plural}. Invoked...`);
};

exports.delete.one = (req, res, next) => {
  // console.info(`${metalog.resource.controller}.delete.one(): Destroy ${metalog.resource.singular}. Invoked...`);
};

exports.delete.many = (req, res, next) => {
  // console.info(`${metalog.resource.controller}.delete.one(): Destroy many ${metalog.resource.plural}. Invoked...`);
};

// console.info(`...initialised RESTful resources of ${metalog.resource.plural}.`);