"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyProductFields = void 0;
// interface ProductRequest extends Request {
//   body: {
//     name: string;
//     description: string;
//     price: string | number;
//   };
// }
const verifyProductFields = (req, res, next) => {
    // req.body가 문자열로 전달된 경우 파싱
    if (typeof req.body === "string") {
        try {
            req.body = JSON.parse(req.body);
        }
        catch (e) {
            res
                .status(400)
                .send({ message: "요청 데이터 형식이 올바르지 않습니다." });
            return;
        }
    }
    // FormData로 전송된 경우 필드가 문자열로 전달될 수 있음
    const { name, description, price } = req.body;
    if (!name || !description || !price) {
        res.status(400).send({ message: "모든 필수 필드를 입력해주세요." });
        return;
    }
    // 상품이름 10자 이내 검증
    if (name.length > 10) {
        res.status(400).send({ message: "상품 이름은 10자 이내로 입력해주세요." });
        return;
    }
    // 상품 설명 10자 이상, 100자 이내 검증
    if (description.length < 10 || description.length > 100) {
        res.status(400).send({
            message: "상품 설명은 10자 이상, 100자 이내로 입력해주세요.",
        });
        return;
    }
    // 상품 가격 1원 이상 숫자 검증
    if (isNaN(Number(price)) || Number(price) < 1) {
        res.status(400).send({
            message: "상품 가격은 1원 이상의 숫자로 입력해주세요.",
        });
        return;
    }
    next();
};
exports.verifyProductFields = verifyProductFields;
//# sourceMappingURL=verifyProductFields.js.map