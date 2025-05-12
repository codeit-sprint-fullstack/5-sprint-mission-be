"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.checkUUIDParams = exports.validate = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const zod_1 = require("zod");
const validate = (schema, target = "body") => (req, res, next) => {
    try {
        schema.parse(req[target]);
        next();
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            res.status(400).json({
                message: "유효성 검사 실패",
                errors: err.flatten().fieldErrors,
            });
            return;
        }
        next(err);
    }
};
exports.validate = validate;
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const checkUUIDParams = (...keys) => {
    return (req, res, next) => {
        for (const key of keys) {
            const value = req.params[key];
            if (value && !uuidRegex.test(value)) {
                res.status(400).json({ message: `Invalid ${key}` });
                return;
            }
        }
        next();
    };
};
exports.checkUUIDParams = checkUUIDParams;
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, "uploads/"),
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const basename = path_1.default.basename(file.originalname, ext);
        const safeName = basename.replace(/[^a-zA-Z0-9]/g, "").slice(0, 10);
        cb(null, `${Date.now()}-${safeName}${ext}`);
    },
});
const fileFilter = (_req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(null, false);
    }
    cb(null, true);
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        files: 3,
        fileSize: 5 * 1024 * 1024,
    },
});
