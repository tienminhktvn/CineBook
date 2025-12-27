CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'refunded');
CREATE TYPE payment_method AS ENUM ('credit_card', 'momo', 'zalopay', 'cash');

CREATE TABLE snacks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- e.g., "Combo Popcorn L + Coke"
    unit_price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255)
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Use UUID for external references (QR codes)
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    showtime_id INT REFERENCES showtimes(id),
    booking_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status booking_status DEFAULT 'pending',
    qr_code_hash VARCHAR(255) -- Store a hash or unique string for QR generation
);

CREATE TABLE booking_seats (
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    seat_id INT REFERENCES seats(id),
    price_at_booking DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (booking_id, seat_id)
);

CREATE TABLE booking_snacks (
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    snack_id INT REFERENCES snacks(id),
    quantity INT NOT NULL DEFAULT 1,
    price_at_booking DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (booking_id, snack_id)
);

CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    booking_id UUID UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    method payment_method NOT NULL,
    transaction_reference VARCHAR(255),
    payment_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);