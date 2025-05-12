"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const service_1 = __importDefault(require("./service"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post("/signup", service_1.default.signup);
router.post("/signin", service_1.default.signin);
router.post("/signout", service_1.default.signout);
router.get("/me", auth_1.default.verifyToken, service_1.default.me);
exports.default = router;
//# sourceMappingURL=controller.js.map