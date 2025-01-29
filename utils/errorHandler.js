export const createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const errorHandler = (error, req, res, next) => {
  const status =
    error.name === "StructError" ? 400 : error.status ? error.status : 500;
  res.status(status).send({ message: error.message });
};
