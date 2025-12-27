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

  // Create booking with snacks
  async createWithSnacks(bookingData, snacks) {
    return await this.db.transaction(async (trx) => {
      // Create the booking
      const [newBooking] = await trx("bookings")
        .insert(bookingData)
        .returning("*");

      // Add snacks if provided
      if (snacks && snacks.length > 0) {
        const bookingSnacks = snacks.map((snack) => ({
          booking_id: newBooking.id,
          snack_id: snack.snack_id,
          quantity: snack.quantity,
          price_at_booking: snack.price_at_booking,
        }));
        await trx("booking_snacks").insert(bookingSnacks);
      }

      return newBooking;
    });
  }

  // Get booking with snacks
  async findByIdWithSnacks(id) {
    const booking = await this.db("bookings").where("id", id).first();
    if (!booking) return null;

    const snacks = await this.db("booking_snacks")
      .join("snacks", "booking_snacks.snack_id", "snacks.id")
      .where("booking_snacks.booking_id", id)
      .select(
        "snacks.id",
        "snacks.name",
        "snacks.image_url",
        "booking_snacks.quantity",
        "booking_snacks.price_at_booking"
      );

    return { ...booking, snacks };
  }

  // Get all bookings with snacks info
  async findAllWithSnacks() {
    const bookings = await this.db("bookings").orderBy("booking_date", "desc");

    // Get snacks for all bookings
    const bookingIds = bookings.map((b) => b.id);
    const allSnacks = await this.db("booking_snacks")
      .join("snacks", "booking_snacks.snack_id", "snacks.id")
      .whereIn("booking_snacks.booking_id", bookingIds)
      .select(
        "booking_snacks.booking_id",
        "snacks.id",
        "snacks.name",
        "booking_snacks.quantity",
        "booking_snacks.price_at_booking"
      );

    // Group snacks by booking_id
    const snacksByBooking = allSnacks.reduce((acc, snack) => {
      if (!acc[snack.booking_id]) acc[snack.booking_id] = [];
      acc[snack.booking_id].push(snack);
      return acc;
    }, {});

    return bookings.map((booking) => ({
      ...booking,
      snacks: snacksByBooking[booking.id] || [],
    }));
  }

  // Update booking snacks
  async updateSnacks(bookingId, snacks) {
    return await this.db.transaction(async (trx) => {
      // Delete existing snacks
      await trx("booking_snacks").where("booking_id", bookingId).delete();

      // Add new snacks if provided
      if (snacks && snacks.length > 0) {
        const bookingSnacks = snacks.map((snack) => ({
          booking_id: bookingId,
          snack_id: snack.snack_id,
          quantity: snack.quantity,
          price_at_booking: snack.price_at_booking,
        }));
        await trx("booking_snacks").insert(bookingSnacks);
      }
    });
  }
}

module.exports = new BookingRepository();
