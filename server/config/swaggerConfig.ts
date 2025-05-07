import swaggerJsdoc, { Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";

const options: Options = {
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
  apis: [path.resolve("server/routes/**/*.ts")],
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
