"use strict";

const { SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");
const ProductService2 = require("../services/product.service.xxx");

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "create new Product success!",
      metadata: await ProductService2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  //  Query

  /**
   * @des Get all drafts for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list drafts success!",
      metadata: await ProductService2.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list publish success !",
      metadata: await ProductService2.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  publishedProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Published Product Success!",
      metadata: await ProductService2.publishProduct({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  //  End Query
}

module.exports = new ProductController();
