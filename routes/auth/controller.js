import service from "./service.js";

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await service.authenticateUser(username, password);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    req.session.user = { id: user.id, username: user.username }; // 세션 저장
    res.json({ message: "Login successful", user: req.session.user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
};
