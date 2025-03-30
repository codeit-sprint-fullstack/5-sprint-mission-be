"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTags = void 0;
/**
 * 태그 문자열을 배열로 변환
 * @param tags 태그 데이터
 * @returns 문자열 배열
 */
const parseTags = (tags) => {
    if (!tags)
        return undefined;
    if (typeof tags === "string") {
        if (tags.includes(",")) {
            return tags.split(",").map((tag) => tag.trim());
        }
        else {
            try {
                return JSON.parse(tags);
            }
            catch (e) {
                return [tags];
            }
        }
    }
    else if (Array.isArray(tags)) {
        return tags;
    }
    return undefined;
};
exports.parseTags = parseTags;
