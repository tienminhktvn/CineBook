const GenericRepository = require("./generic.repository");

class RoleRepository extends GenericRepository {
  constructor() {
    super("roles");
  }

  /**
   * Find a role by its name
   * @param {string} name - Role name (customer, admin, staff)
   */
  async findByName(name) {
    return this.db(this.tableName).where({ name }).first();
  }
}

module.exports = new RoleRepository();
