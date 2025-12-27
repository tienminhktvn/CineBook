const knex = require("knex");
require("dotenv").config();

const config = require("../knexfile");

const environment = process.env.NODE_ENV || "development";

const db = knex(config[environment]);

module.exports = db;
