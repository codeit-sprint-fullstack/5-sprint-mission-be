import app from "./app";

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🌐Server is running on port ${PORT}`);
  console.log(`🚀Swagger Docs: http://localhost:${PORT}/api-docs`);
});
