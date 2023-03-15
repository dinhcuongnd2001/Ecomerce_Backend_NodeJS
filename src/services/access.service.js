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
  AuthFailureError,
} = require("../core/error.response");

// service //
const { findByEmail } = require("./shop.service");

const Roleshop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  /*
  Login
  B1. Check Email
  B2. match password
  B3. Create AT vs RT and save
  B4. generate tokens
  B5. get data return login
  */
  static login = async ({ email, password, refreshToken = null }) => {
    // 1
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("shop is not register");
    // 2
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Authentication error");
    // 3
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");
    // 4
    const token = await createTokenPair(
      { userId: foundShop._id, email },
      publicKey,
      privateKey
    );
    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      refreshToken: token.refreshToken,
      privateKey,
      publicKey,
    });
    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      token,
    };
  };

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
