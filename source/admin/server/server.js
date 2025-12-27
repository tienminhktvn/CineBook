const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Admin Server running on http://localhost:${PORT}`);
  console.log(`Admin Swagger running on http://localhost:${PORT}/docs`);
});
