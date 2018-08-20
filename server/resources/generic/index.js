const metalog = {};
metalog.resource = {};
metalog.resource.title = 'Generic Resource';
metalog.prefix = ` ->`;

console.info(`${metalog.resource.title}: Loading resource...`);
console.info(`${metalog.prefix} Importing dependencies...`);

const express = require("express");
const router = express.Router();
const controller = require("./controller");

console.info(`${metalog.prefix} ...imported dependencies.`);

router.post("/", controller.create.one);
router.post("/many", controller.create.many);

router.get("/:id", controller.read.one);
router.get("/", controller.read.many);

router.put("/:id", controller.update.one);
router.put("/", controller.update.many);

router.delete("/:id", controller.delete.one);
router.delete("/", controller.delete.many);

console.info(`${metalog.resource.title}: ...Loaded resource.`);

module.exports = router;
