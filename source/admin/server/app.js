const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger UI - Available at /docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/movies", require("./routes/v1/movie.routes"));

module.exports = app;
