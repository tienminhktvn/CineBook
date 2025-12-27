const GenericRepository = require("./generic.repository");

class UserRepository extends GenericRepository {
  constructor() {
    super("users");
  }

  /**
   * Find a user by username
   * @param {string} username
   */
  async findByUsername(username) {
    return this.db(this.tableName).where({ username }).first();
  }

  /**
   * Find a user by email
   * @param {string} email
   */
  async findByEmail(email) {
    return this.db(this.tableName).where({ email }).first();
  }

  /**
   * Find a user with their role information
   * @param {number} id - User ID
   */
  async findByIdWithRole(id) {
    return this.db(this.tableName)
      .select(
        "users.id",
        "users.username",
        "users.email",
        "users.phone_number",
        "users.full_name",
        "users.status",
        "users.created_at",
        "roles.name as role",
        "roles.id as role_id"
      )
      .leftJoin("roles", "users.role_id", "roles.id")
      .where("users.id", id)
      .first();
  }

  /**
   * Find a user by username with role (for login)
   * @param {string} username
   */
  async findByUsernameWithRole(username) {
    return this.db(this.tableName)
      .select(
        "users.id",
        "users.username",
        "users.password_hash",
        "users.email",
        "users.phone_number",
        "users.full_name",
        "users.status",
        "users.created_at",
        "roles.name as role",
        "roles.id as role_id"
      )
      .leftJoin("roles", "users.role_id", "roles.id")
      .where("users.username", username)
      .first();
  }

  /**
   * Check if username or email already exists
   * @param {string} username
   * @param {string} email
   */
  async existsByUsernameOrEmail(username, email) {
    const user = await this.db(this.tableName)
      .where({ username })
      .orWhere({ email })
      .first();
    return !!user;
  }

  /**
   * Get all users with their roles (for admin)
   */
  async findAllWithRoles() {
    return this.db(this.tableName)
      .select(
        "users.id",
        "users.username",
        "users.email",
        "users.phone_number",
        "users.full_name",
        "users.status",
        "users.created_at",
        "roles.name as role"
      )
      .leftJoin("roles", "users.role_id", "roles.id");
  }
}

module.exports = new UserRepository();
