const SeatType = {
  STANDARD: "standard",
  VIP: "vip",
  COUPLE: "couple",
};

const HallStatus = {
  ACTIVE: "active",
  MAINTENANCE: "maintenance",
};

const BookingStatus = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
};

module.exports = { SeatType, HallStatus, BookingStatus };
