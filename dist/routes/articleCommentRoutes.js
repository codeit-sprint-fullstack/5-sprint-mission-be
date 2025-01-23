"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const articleCommentController_1 = require("../controllers/articleCommentController");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post('/:articleId', articleCommentController_1.createComment);
router.get('/:articleId', articleCommentController_1.getComment);
router.patch('/:id', articleCommentController_1.updateComment);
router.delete('/:id', articleCommentController_1.deleteComment);
exports.default = router;
