export const validateProduct = (req, res, next) => {
  const { name, description, price } = req.body;

  if (!name || !description || !price) {
    return next({ status: 400, message: "모든 필드를 입력해야 합니다." });
  }
  if (typeof price !== "number" || price <= 0) {
    return next({ status: 400, message: "가격은 0보다 큰 숫자여야 합니다." });
  }
  next();
};
