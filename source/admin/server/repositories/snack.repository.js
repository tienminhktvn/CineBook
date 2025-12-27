const GenericRepository = require("./generic.repository");

class SnackRepository extends GenericRepository {
  constructor() {
    super("snacks");
  }
}

module.exports = new SnackRepository();
