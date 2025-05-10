import app from "./app";

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Docs available at http://localhost:${PORT}/api-docs`);
});
