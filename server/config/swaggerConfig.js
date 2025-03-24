import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "판다 마켓 API 문서",
      version: "1.0.0",
      description: "판다 마켓 RESTful API에 대한 문서입니다.",
    },
    servers: [{ url: "/" }],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: [path.resolve(__dirname, "../routes/**/*.js")],
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
