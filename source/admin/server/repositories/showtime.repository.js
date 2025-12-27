const GenericRepository = require("./generic.repository");

class ShowtimeRepository extends GenericRepository {
  constructor() {
    super("showtimes");
  }

  // Check if a specific time slot is free in a specific hall
  async checkOverlap(hallId, startTime, endTime) {
    const existing = await this.db("showtimes")
      .where("hall_id", hallId)
      // The Overlap Logic: (StartA < EndB) and (EndA > StartB)
      .andWhere("start_time", "<", endTime)
      .andWhere("end_time", ">", startTime)
      .first();

    return !!existing; // Returns true if overlap exists
  }
}

module.exports = new ShowtimeRepository();
