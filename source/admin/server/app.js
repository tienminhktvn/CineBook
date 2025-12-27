const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const { authenticateToken, isAdmin } = require("./middleware");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get("/health", (_, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Auth routes
app.use("/api/v1/auth", require("./routes/v1/auth.routes"));

// Protected Admin Routes
const adminRouter = express.Router();
adminRouter.use(authenticateToken);
adminRouter.use(isAdmin);

adminRouter.use("/movies", require("./routes/v1/movie.routes"));
adminRouter.use("/halls", require("./routes/v1/hall.routes"));
adminRouter.use("/showtimes", require("./routes/v1/showtime.routes"));
adminRouter.use("/bookings", require("./routes/v1/booking.routes"));

app.use("/api/v1", adminRouter);

module.exports = app;
