export const createError = (message, status = 500) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export const errorHandler = (error, req, res, next) => {
  const status = error.name === "StructError" ? 400 : error.status || 500;
  res.status(status).send({ message: error.message });
};
