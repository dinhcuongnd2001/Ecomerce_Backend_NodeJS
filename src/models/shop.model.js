"use strict";
const { model, Schema, Types } = require("mongoose");

// Declare the Schema of the Mongo model
const DOCUMENT_NAME = "Shop";
const COLLECTION_NAME = "Shops";

var shopSchema = Schema(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      // active hay chưa active
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    verfify: {
      // xác thực xem shop này đã đăng ký thành công hay chưa
      type: Schema.Types.Boolean,
      default: "false",
    },
    roles: {
      // kiểm tra xem shop này có những quuyền gì, xem xóa, sản phẩm.
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, shopSchema);
