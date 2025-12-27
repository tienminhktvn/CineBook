const BaseRepository = require("./base.repository");

class MovieRepository extends BaseRepository {
  constructor() {
    super("movies");
  }
}

module.exports = new MovieRepository();
