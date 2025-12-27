const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const { authenticateToken, isAdmin, isAdminOrStaff } = require("./middleware");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
