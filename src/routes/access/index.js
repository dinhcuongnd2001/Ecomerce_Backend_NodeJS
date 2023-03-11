"use strict";

const express = require("express");
const router = express.Router();
const accessController = require("../../controllers/access.controller");
const { asynHandler } = require("../../auth/checkAuth");
// signUp

router.post("/shop/signup", asynHandler(accessController.signUp));

module.exports = router;
