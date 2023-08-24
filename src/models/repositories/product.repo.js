"use strict";

const {
  product,
  electronic,
  clothing,
  furniture,
} = require("../../models/product.model");

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email _id")
    .sort({ createdAt: -1 })
    .skip(skip)
    .lean()
    .exec();
};
