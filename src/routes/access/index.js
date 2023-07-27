"use strict";

const express = require("express");
const router = express.Router();
const accessController = require("../../controllers/access.controller");
const { asynHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
// signUp

router.post("/shop/signup", asynHandler(accessController.signUp));
router.post("/shop/login", asynHandler(accessController.login));

// authentication
router.use(authentication);
router.post("/shop/logout", asynHandler(accessController.logout));

module.exports = router;
