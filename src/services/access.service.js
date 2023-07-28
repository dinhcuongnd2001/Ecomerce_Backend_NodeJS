"use strict";
const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  ConflictRequestError,
  AuthFailureError,
  ForbiddenError,
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
  };

  static logout = async (keyStore) => {
    // return (delKey = await KeyTokenService.removeKeyById(keyStore._id));
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    return delKey;
  };

  static handlerRefreshToken = async (refreshToken) => {
    // Check Token Used
    console.log("1 ::", refreshToken);
    const foundToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!foundToken) throw new AuthFailureError("Shop not registered1");

    // decode de lay thong tin kiem tra
    const { userId, email } = await verifyJWT(
      refreshToken,
      foundToken.privateKey
    );

    if (foundToken.refreshTokensUsed.includes(refreshToken)) {
      // xoa tat ca token trong store
      await KeyTokenService.deleteKeyByUserId(userId);
      throw new ForbiddenError("something wrong happen !! pls relogin");
    }

    // neu chua co su dung token thi kiem tra xem co ton tai user kia khong
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not registered");

    // tao mot cap token moi
    const tokens = await createTokenPair(
      { userId, email },
      foundToken.publicKey,
      foundToken.privateKey
    );

    await foundToken.update({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });
    return {
      user: { userId, email },
      tokens,
    };
  };
}

module.exports = AccessService;
