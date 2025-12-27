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

const Role = {
  CUSTOMER: "customer",
  ADMIN: "admin",
  STAFF: "staff",
};

const UserStatus = {
  ACTIVE: "active",
  BLOCKED: "blocked",
  PENDING: "pending",
};

module.exports = { SeatType, HallStatus, BookingStatus, Role, UserStatus };
