const commonDto = require("./common.dto");
const movieDto = require("./movie.dto");
const hallDto = require("./hall.dto");
const showtimeDto = require("./showtime.dto");
const bookingDto = require("./booking.dto");
const authDto = require("./auth.dto");
const userDto = require("./user.dto");

module.exports = {
  // Common
  ...commonDto,

  // Movie
  ...movieDto,

  // Hall
  ...hallDto,

  // Showtime
  ...showtimeDto,

  // Booking
  ...bookingDto,

  // Auth
  ...authDto,

  // User
  ...userDto,
};
