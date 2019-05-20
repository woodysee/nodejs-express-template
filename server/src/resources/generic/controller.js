// console.info(`Initialising RESTful resources...`);
const metalog = {};
metalog.resource = {};
metalog.resource.singular = `generic resource`;
metalog.resource.plural = `generic resources`;
metalog.resource.controller = `genericController`;

const create = {};
const read = {};
const update = {};
const remove = {};

const createOne = (req, res, next) => {
  // console.info(`${metalog.resource.controller}.create.one(): Create a ${metalog.resource.singular}. Invoked...`);
};

const createMany = (req, res, next) => {
  // console.info(`${metalog.resource.controller}.create.many(): Creates ${metalog.resource.plural}. Invoked...`);
};

const readOne = (req, res, next) => {
  // console.info(`${metalog.resource.controller}.read.one(): Show ${metalog.resource.singular} details. Invoked...`);
};

const readMany = (req, res, next) => {
  // console.info(`${metalog.resource.controller}.read.many(): Show details of ${metalog.resource.plural}. Invoked...`);
};

const updateOne = (req, res, next) => {
  // console.info(`${metalog.resource.controller}.update.one(): Update details of a ${metalog.resource.singular}. Invoked...`);
};

const updateMany = (req, res, next) => {
  // console.info(`${metalog.resource.controller}.update.many(): Update info of many ${metalog.resource.plural}. Invoked...`);
};

const deleteOne = (req, res, next) => {
  // console.info(`${metalog.resource.controller}.delete.one(): Destroy ${metalog.resource.singular}. Invoked...`);
};

const deleteMany = (req, res, next) => {
  // console.info(`${metalog.resource.controller}.delete.one(): Destroy many ${metalog.resource.plural}. Invoked...`);
};

// console.info(`...initialised RESTful resources of ${metalog.resource.plural}.`);

export default {
  create: {
    one: createOne,
    many: createMany,
  },
  read: {
    one: readOne,
    many: readMany,
  },
  update: {
    one: updateOne,
    many: updateMany,
  },
  delete: {
    one: deleteOne,
    many: deleteMany,
  },
};
