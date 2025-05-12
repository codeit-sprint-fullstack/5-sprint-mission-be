"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSchema = void 0;
const zod_1 = require("zod");
exports.productSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    price: zod_1.z.coerce.number().nonnegative(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    imageUrls: zod_1.z.array(zod_1.z.string()).max(3).optional(),
});
