"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productCommentController_1 = require("../controllers/productCommentController");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post('/:productId', productCommentController_1.createComment);
router.get('/:productId', productCommentController_1.getComment);
router.patch('/:id', productCommentController_1.updateComment);
router.delete('/:id', productCommentController_1.deleteComment);
exports.default = router;
