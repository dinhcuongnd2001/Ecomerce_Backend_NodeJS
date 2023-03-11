"use strict";
const AccessService = require("../services/access.service");
const { OK, CREATED } = require("../core/success.response");
class AccessController {
  signUp = async (req, res, next) => {
    // try {
    //   const result = await AccessService.signUp({ ...req.body });
    //   return res.status(result.code).json(result);
    // } catch (error) {
    //   next(error);
    // }
    const result = await AccessService.signUp({ ...req.body });
    new CREATED({
      message: "Regiserted OK!",
      metadata: result,
    }).send(res);
    // return res.status(result.code).json(result);
  };
}

module.exports = new AccessController();
