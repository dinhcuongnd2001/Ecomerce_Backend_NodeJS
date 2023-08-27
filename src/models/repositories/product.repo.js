"use strict";

const { Types } = require("mongoose");
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

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundProduct = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  foundProduct;

  if (!foundProduct) return null;
  foundProduct.isDraft = false;
  foundProduct.isPublict = true;
  const { _id, ...rest } = foundProduct;

  const { modifiedCount } = await product.where({ _id }).update(foundProduct);

  return modifiedCount;
};

module.exports = {
  findAllDraftsForShop,
  publishProductByShop,
};
