"use strict";

const keytokenModel = require("../models/keyToken.model");
const { Types } = require("mongoose");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // level 0
      // const tokens = await keytokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // });
      // return tokens ? tokens.publicKey : null;

      // level xxx
      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokensUsed: [],
          refreshToken,
        },
        option = { upsert: true, new: true };
      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        option
      );

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };

  static findByUserId = async (userId) => {
    return await keytokenModel.findOne({ user: Types.ObjectId(userId) });
  };

  static removeKeyById = async (id) => {
    return await keytokenModel.remove(id).lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return keytokenModel.findOne({ refreshToken });
  };

  static deleteKeyByUserId = async (userId) => {
    return await keytokenModel.deleteOne({
      user: Types.ObjectId(userId),
    });
  };
}

module.exports = KeyTokenService;
