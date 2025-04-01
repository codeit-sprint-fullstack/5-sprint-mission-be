/**
 * 태그 문자열을 배열로 변환
 * @param tags 태그 데이터
 * @returns 문자열 배열
 */
export const parseTags = (tags: any): string[] | undefined => {
  if (!tags) return undefined;

  if (typeof tags === "string") {
    if (tags.includes(",")) {
      return tags.split(",").map((tag) => tag.trim());
    } else {
      try {
        return JSON.parse(tags);
      } catch (e) {
        return [tags];
      }
    }
  } else if (Array.isArray(tags)) {
    return tags;
  }

  return undefined;
};
