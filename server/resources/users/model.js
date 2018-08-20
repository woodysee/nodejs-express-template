// const metalog = {};
// metalog.name = 'Users';
// metalog.prefix = ` ->`;

// console.info(`${metalog.prefix} Loading ${metalog.name} model...`);
// console.info(`  ${metalog.prefix} Importing dependencies...`);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// console.info(`  ${metalog.prefix} ...imported dependencies.`);

const userSchema = new Schema(
  {
    id: { type: String, unique: true },
    name: {
      first: { type: String },
      last: { type: String },
      alias: { type: String, unique: true }
    },
    contact: {
      email: { type: String },
    },
    password: {
      hash: { type: String },
      strategy: { type: String }
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

// console.info(`${metalog.prefix} ...Loaded ${metalog.name} model.`);

module.exports = User;