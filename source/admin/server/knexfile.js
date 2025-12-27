require("dotenv").config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST || "localhost",
      port: 5432,
      user: process.env.DB_USER || "cinema_admin",
      password: process.env.DB_PASSWORD || "securepassword123",
      database: process.env.DB_NAME || "cinema_booking",
    },
  },
  seeds: {
    directory: "./seeds",
  },
};
