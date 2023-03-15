"use strict";
const AccessService = require("../services/access.service");
const { OK, CREATED, SuccessResponse } = require("../core/success.response");
class AccessController {
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
