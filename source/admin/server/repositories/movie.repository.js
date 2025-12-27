const GenericRepository = require("./generic.repository");

class MovieRepository extends GenericRepository {
  constructor() {
    super("movies");
  }
}

module.exports = new MovieRepository();
