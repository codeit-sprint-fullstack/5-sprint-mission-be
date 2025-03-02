import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || 'ABC';

const authenticateToken = (req, res, next) => {
  // console.log(jwt.sign({ userId: 123 }, SECRET_KEY, { expiresIn: "1h" })) // 임시 토큰 발급
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    next();
  });
};