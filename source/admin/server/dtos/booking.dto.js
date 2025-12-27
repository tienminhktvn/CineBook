const { BookingStatus } = require("../models/enum");

const Booking = {
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid",
      description: "Unique identifier for the booking (UUID)",
      example: "550e8400-e29b-41d4-a716-446655440000",
    },
    user_id: {
      type: "integer",
      description: "ID of the user who made the booking",
      example: 1,
    },
    showtime_id: {
      type: "integer",
      description: "ID of the booked showtime",
      example: 1,
    },
    booking_date: {
      type: "string",
      format: "date-time",
      description: "Date and time when the booking was made",
    },
    total_amount: {
      type: "number",
      format: "decimal",
      description: "Total amount for the booking",
      example: 150000,
    },
    status: {
      type: "string",
      enum: Object.values(BookingStatus),
      description: "Current status of the booking",
      example: BookingStatus.CONFIRMED,
    },
    qr_code_hash: {
      type: "string",
      description: "Hash for the booking QR code",
      example: "valid_qr_hash_123",
    },
  },
};

const BookingInput = {
  type: "object",
  required: ["user_id", "showtime_id"],
  properties: {
    user_id: {
      type: "integer",
      description: "ID of the user making the booking",
      example: 1,
    },
    showtime_id: {
      type: "integer",
      description: "ID of the showtime to book",
      example: 1,
    },
    total_amount: {
      type: "number",
      format: "decimal",
      description: "Total amount for the booking",
      example: 150000,
    },
    status: {
      type: "string",
      enum: Object.values(BookingStatus),
      description: "Initial status of the booking",
      example: BookingStatus.PENDING,
    },
    qr_code_hash: {
      type: "string",
      description: "Hash for the booking QR code",
      example: "valid_qr_hash_123",
    },
  },
};

const BookingUpdateInput = {
  type: "object",
  properties: {
    total_amount: {
      type: "number",
      format: "decimal",
      description: "Total amount for the booking",
      example: 150000,
    },
    status: {
      type: "string",
      enum: Object.values(BookingStatus),
      description: "Current status of the booking",
      example: BookingStatus.CONFIRMED,
    },
    qr_code_hash: {
      type: "string",
      description: "Hash for the booking QR code",
      example: "valid_qr_hash_123",
    },
  },
};

const RevenueResponse = {
  type: "object",
  properties: {
    success: {
      type: "boolean",
      example: true,
    },
    data: {
      type: "object",
      properties: {
        total_revenue: {
          type: "number",
          format: "decimal",
          description: "Total revenue from confirmed bookings",
          example: 1500000,
        },
      },
    },
  },
};

module.exports = {
  BookingStatus,
  Booking,
  BookingInput,
  BookingUpdateInput,
  RevenueResponse,
};
