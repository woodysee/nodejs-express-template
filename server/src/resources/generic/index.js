const metalog = {
  resource: {
    title: 'Generic Resource',
  },
  prefix: ' ->',
};

console.info(`${metalog.resource.title}: Loading resource...`);
console.info(`${metalog.prefix} Importing dependencies...`);

// import express from 'express';
const express = require('express');
import genericController from './controller';

console.info(`${metalog.prefix} ...imported dependencies.`);

const router = express.Router();

router.post('/', genericController.create.one);
router.post('/many', genericController.create.many);

router.get('/:id', genericController.read.one);
router.get('/', genericController.read.many);

router.put('/:id', genericController.update.one);
router.put('/', genericController.update.many);

router.delete('/:id', genericController.delete.one);
router.delete('/', genericController.delete.many);

console.info(`${metalog.resource.title}: ...Loaded resource.`);

export default router;
