import prisma from "../../prismaClient.js";
import bcrypt from "bcrypt";

const authenticateUser = async (username, password) => {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch ? user : null;
};

export default { authenticateUser };
