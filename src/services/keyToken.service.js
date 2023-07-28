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
    return await keytokenModel.findOne({ user: Types.ObjectId(userId) }).lean();
  };

  static removeKeyById = async (id) => {
    return await keytokenModel.remove(id).lean();
  };

  // static findByRefreshTokenUsed = async (refreshToken) => {
  //   // Check xem refreshToken nay da duoc su dung chua
  //   return await keytokenModel
  //     .findOne({ refreshTokensUsed: refreshToken })
  //     .lean();
  // };

  static findByRefreshToken = async (refreshToken) => {
    return keytokenModel.findOne({ refreshToken });
  };

  static deleteKeyByUserId = async (userId) => {
    return await keytokenModel.findByIdAndDelete({ user: userId });
  };
}

module.exports = KeyTokenService;
