"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (err, req, res, next) => {
    console.log(err);
    res.status(500).json({ message: "500에러" });
};
