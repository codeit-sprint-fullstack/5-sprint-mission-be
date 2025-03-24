export function checkUUID(req, res, next) {
  const { articleId, commentId, id } = req.params;
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (id && !uuidRegex.test(id))
    return res.status(400).json({ message: "Invalid article ID" });
  if (articleId && !uuidRegex.test(articleId))
    return res.status(400).json({ message: "Invalid article ID" });
  if (commentId && !uuidRegex.test(commentId))
    return res.status(400).json({ message: "Invalid comment ID" });

  next();
}
