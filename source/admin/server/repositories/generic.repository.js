const db = require("../config/database");

class GenericRepository {
  constructor(tableName) {
    this.tableName = tableName;
    this.db = db;
  }

  // Get All
  async findAll() {
    return this.db(this.tableName).select("*");
  }

  // Get One by ID
  async findById(id) {
    return this.db(this.tableName).where({ id }).first();
  }

  // Create (Generic)
  async create(data) {
    const [result] = await this.db(this.tableName).insert(data).returning("*");
    return result;
  }

  // Update
  async update(id, data) {
    const [result] = await this.db(this.tableName)
      .where({ id })
      .update(data)
      .returning("*");
    return result;
  }

  // Delete
  async delete(id) {
    return this.db(this.tableName).where({ id }).delete().returning("*");
  }
}

module.exports = GenericRepository;
