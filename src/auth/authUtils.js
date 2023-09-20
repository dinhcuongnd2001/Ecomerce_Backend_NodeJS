"use strict";

const JWT = require("jsonwebtoken");
const { asynHandler } = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "x-rtoken-id",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // accessToken
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "1h",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7h",
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`error verify::`, err);
      } else {
        console.log(`decode verify::`, decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {}
};

const authentication = asynHandler(async (req, res, next) => {
  /*
    1 - check userId missing?
    2 - get accessToken.
    3 - verify accessToken
    4 - check user in dbs
    5 - check Keystore with this userId
    6 - Ok all => return next()
  */

  //  1 Kiem tra xem co nguoi dung khonguser
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid Request");
  // 2 Kiem tra xem co ky store khong
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not found keyStore");
  // 3

  if (req.headers[HEADER.REFRESHTOKEN]) {
    const refreshToken = req.headers[HEADER.REFRESHTOKEN];
    try {
      const decodeRefreshToken = JWT.decode(refreshToken, keyStore.privateKey);
      req.keyStore = keyStore;
      req.user = decodeRefreshToken; // {userId, email}
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw new AuthFailureError("Invalid Request");
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request");

  try {
    const decodeUser = JWT.decode(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid Request");
    req.keyStore = keyStore;
    req.user = decodeUser;
    return next();
  } catch (error) {
    throw new AuthFailureError("Invalid Request");
  }
});

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
};
