"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.articleSchema = void 0;
const zod_1 = require("zod");
exports.articleSchema = zod_1.z.object({
    title: zod_1.z.string().min(2).max(30),
    content: zod_1.z.string().min(10).max(100),
    imageUrls: zod_1.z.array(zod_1.z.string()).max(3).optional(),
});
