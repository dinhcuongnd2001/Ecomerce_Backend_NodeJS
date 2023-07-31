"use strict";
const AccessService = require("../services/access.service");
const { OK, CREATED, SuccessResponse } = require("../core/success.response");
class AccessController {
  handlerRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      message: "Get token success!",
      metadata: await AccessService.handlerRefreshToken({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };

  logout = async (req, res, next) => {
    const result = await AccessService.logout(req.keyStore);
    new SuccessResponse({
      metadata: result,
    }).send(res);
  };

  login = async (req, res, next) => {
    const result = await AccessService.login(req.body);
    new SuccessResponse({
      metadata: result,
    }).send(res);
  };

  signUp = async (req, res, next) => {
    const result = await AccessService.signUp({ ...req.body });
    new CREATED({
      message: "Regiserted OK!",
      metadata: result,
    }).send(res);
  };
}

module.exports = new AccessController();
