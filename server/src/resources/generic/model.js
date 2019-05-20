// const metalog = {
//   resource: {
//     title: 'Generic Resource',
//   },
//   prefix: ' ->',
// };

// console.info(`${metalog.prefix} Loading ${metalog.resource.title} model...`);
// console.info(`  ${metalog.prefix} Importing dependencies...`);

import { Schema, model } from 'mongoose';

// console.info(`  ${metalog.prefix} ...imported dependencies.`);

const genericSchema = new Schema(
  {
    id: { type: String, unique: true },
    name: {
      first: { type: String },
      last: { type: String },
      alias: { type: String, unique: true },
    },
    contact: {
      email: { type: String },
    },
    password: {
      salt: {
        value: { type: String },
        rounds: { type: Number },
      },
      hash: { type: String },
      strategy: { type: String },
    },
  },
  { timestamps: true }
);

const Task = model('Generic', genericSchema);

// console.info(`${metalog.prefix} ...Loaded ${metalog.resource.title} model.`);

export default Task;
