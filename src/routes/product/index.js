"use strict";

const express = require("express");
const router = express.Router();
const productController = require("../../controllers/product.controller");
const { asynHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");

// authentication
router.use(authentication);
router.post("", asynHandler(productController.createProduct));

// Query

router.get("/drafts/all", asynHandler(productController.getAllDraftsForShop));
router.get("/publish/all", asynHandler(productController.getAllPublishForShop));
router.post("/published/:id", asynHandler(productController.publishedProduct));

module.exports = router;
