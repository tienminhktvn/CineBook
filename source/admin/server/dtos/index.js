const commonDto = require("./common.dto");
const movieDto = require("./movie.dto");
const hallDto = require("./hall.dto");
const showtimeDto = require("./showtime.dto");
const bookingDto = require("./booking.dto");

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
};
