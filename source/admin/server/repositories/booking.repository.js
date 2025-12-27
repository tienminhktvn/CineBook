const GenericRepository = require("./generic.repository");

class BookingRepository extends GenericRepository {
  constructor() {
    super("bookings");
  }

  async getTotalRevenue() {
    const result = await this.db("bookings")
      .where("status", "confirmed")
      .sum("total_amount as total");
    return result[0].total || 0;
  }
}
module.exports = new BookingRepository();
