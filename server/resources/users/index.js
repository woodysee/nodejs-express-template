const metalog = {};
metalog.name = 'Users';
metalog.prefix = ` ->`;

console.info(`${metalog.name}: Loading resource...`);
// console.info(`${metalog.prefix} Importing dependencies...`);

const express = require("express");
const router = express.Router();
const usersController = require("./controller");

// console.info(`${metalog.prefix} ...imported dependencies.`);
// console.info("Initialising user default RESTful resources...");

router.post("/api", usersController.create.one);
// router.post("/api/many", usersController.create.many);

router.get("/api/:alias", usersController.read.one);
// router.get("/api", usersController.read.many);

// router.put("/api/:alias", usersController.update.one);
// router.put("/api", usersController.update.many);

// router.delete("/api/:alias", usersController.delete.one);
// router.delete("/api", usersController.delete.many);

// console.info("...initialised user default RESTful resources.");
// console.info("Initialising user authentication routes...");

router.get("/auth/login", [usersController.auth.login, usersController.views.profile]);
router.get("/auth", [usersController.auth.check, usersController.auth.resolve]);
router.get("/auth/logout", usersController.auth.logout);

// console.info("...initialised user authentication routes.");

// console.info("Initialising server-side view renderers...");
router.get("/", usersController.views.index);
router.get("/profile/:alias", [usersController.auth.login, usersController.views.profile]);
router.get("/signup", usersController.views.signup);
router.get("/login", usersController.views.login);
router.get("/logout", usersController.views.logout);
// console.info("...initialised server-side view renderers.");

console.info(`${metalog.name}: ...Loaded resource.`);

module.exports = router;