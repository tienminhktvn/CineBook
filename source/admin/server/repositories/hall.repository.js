const GenericRepository = require("./generic.repository");
const { SeatType } = require("../models/enum");

class HallRepository extends GenericRepository {
  constructor() {
    super("cinema_halls");
  }

  async createWithSeats(hallData, rowCount, colCount) {
    return this.db.transaction(async (trx) => {
      const [hall] = await trx("cinema_halls").insert(hallData).returning("*");

      const seats = [];
      const rowLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

      for (let r = 0; r < rowCount; r++) {
        for (let c = 1; c <= colCount; c++) {
          seats.push({
            hall_id: hall.id,
            row_letter: rowLetters[r], // 'A', 'B'...
            seat_number: c,
            type: SeatType.STANDARD,
            is_active: true,
          });
        }
      }

      await trx("seats").insert(seats);

      return hall;
    });
  }
}

module.exports = new HallRepository();
