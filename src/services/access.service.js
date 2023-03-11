"use strict";
const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  ConflictRequestError,
} = require("../core/error.response");
const Roleshop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // step1: check email exists ?
      //   lean giam tai rat nhieu so voi ko lean ss5
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        // return {
        //   code: 400,
        //   message: "Shop already registered !",
        // };
        throw new BadRequestError("Error: Shop already registered!");
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [Roleshop.SHOP],
      });

      if (newShop) {
        // created privateKey, publicKey
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");
        // console.log({ privateKey, publicKey });
        // neu co thi luu vao store
        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
        });

        if (!keyStore) {
          // return {
          //   code: 400,
          //   message: "PublicKeyString error",
          // };
          throw new BadRequestError("Error: PublicKeyString error");
        }

        // Created token pair
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKey,
          privateKey
        );
        console.log("Create Token Success::", tokens);
        return {
          code: 201,
          metadata: {
            shop: getInfoData({
              fields: ["_id", "name", "email"],
              object: newShop,
            }),
            tokens,
          },
        };
      }
    } catch (error) {
      return {
        code: error.status,
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
