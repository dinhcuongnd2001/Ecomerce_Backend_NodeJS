"use strict";

const { model, Schema, Types } = require("mongoose");
// Declare the Schema of the Mongo model
const DOCUMENT_NAME = "Apikey";
const COLLECTION_NAME = "Apikeys";
// lưu trữ apikey để xem người dùng có quyểnf truy cập vào hệ thống hay không.
var apiKeySchema = new Schema(
  {
    key: {
      // sinh ra key để phát cho người dùng, người dùng cầm key thêm vào header để sử dụng các mục tài nguyên nhất định (permission)
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      // có hoạt động hay không
      type: Boolean,
      default: true,
    },
    permissions: {
      // chia ra các mức truy cập của khách hàng .
      type: [String],
      require: true,
      enum: ["0000", "1111", "2222"],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, apiKeySchema);
