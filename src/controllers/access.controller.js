"use strict";
class AccessController {
  signUp = async (req, res, next) => {
    try {
      console.log(`[P]::signup::`, req.body);
      /*
            200 OK
            201 CREATE
        */
      return res.status(201).json({
        code: "20001",
        metadata: { userId: 1 },
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AccessController();
