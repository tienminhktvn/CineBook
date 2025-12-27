const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const { logger, requestLogger } = require("./config/logger");
const { authenticateToken, isAdmin, isAdminOrStaff } = require("./middleware");
require("dotenv").config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // Allow cookies to be sent
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger); // Log all HTTP requests

// Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get("/health", (_, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Auth routes
app.use("/api/v1/auth", require("./routes/v1/auth.routes"));

// Admin + Staff Routes
const staffRouter = express.Router();
staffRouter.use(authenticateToken);
staffRouter.use(isAdminOrStaff);

staffRouter.use("/movies", require("./routes/v1/movie.routes"));
staffRouter.use("/halls", require("./routes/v1/hall.routes"));
staffRouter.use("/showtimes", require("./routes/v1/showtime.routes"));
staffRouter.use("/bookings", require("./routes/v1/booking.routes"));

app.use("/api/v1", staffRouter);

// Admin Only Routes
const adminRouter = express.Router();
adminRouter.use(authenticateToken);
adminRouter.use(isAdmin);

adminRouter.use("/users", require("./routes/v1/user.routes"));

app.use("/api/v1", adminRouter);

module.exports = app;
