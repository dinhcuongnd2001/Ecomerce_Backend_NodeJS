"use strict";

const { model, Schema, Types } = require("mongoose");
// Declare the Schema of the Mongo model
const DOCUMENT_NAME = "Apikey";
const COLLECTION_NAME = "Apikeys";
var apiKeySchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
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
