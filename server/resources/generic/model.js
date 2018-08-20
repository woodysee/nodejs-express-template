// const metalog = {};
// metalog.resource = {};
// metalog.resource.title = 'Generic Resource';
// metalog.prefix = ` ->`;

// console.info(`${metalog.prefix} Loading ${metalog.resource.title} model...`);
// console.info(`  ${metalog.prefix} Importing dependencies...`);

const mongoose = require("mongoose");

// console.info(`  ${metalog.prefix} ...imported dependencies.`);

const genericSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true },
    name: {
      first: { type: String },
      last: { type: String },
      alias: { type: String, unique: true }
    },
    contact: {
      email: { type: String }
    },
    password: {
      salt: {
        value: { type: String },
        rounds: { type: Number }
      },
      hash: { type: String },
      strategy: { type: String }
    }
  },
  { timestamps: true }
);

const Task = mongoose.model("Generic", genericSchema);

// console.info(`${metalog.prefix} ...Loaded ${metalog.resource.title} model.`);

module.exports = Task;
