CREATE TYPE seat_type AS ENUM ('standard', 'vip', 'couple');
CREATE TYPE hall_status AS ENUM ('active', 'maintenance');

CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(100),
    description TEXT,
    duration_minutes INT,
    poster_url VARCHAR(255),
    release_date DATE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE cinema_halls (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL, -- e.g., "Room 1", "IMAX Hall"
    total_seats INT NOT NULL,
    status hall_status DEFAULT 'active'
);

CREATE TABLE seats (
    id SERIAL PRIMARY KEY,
    hall_id INT REFERENCES cinema_halls(id) ON DELETE CASCADE,
    row_letter VARCHAR(2) NOT NULL, -- e.g., 'A', 'B', 'AA'
    seat_number INT NOT NULL,    -- e.g., 1, 2, 15
    type seat_type DEFAULT 'standard',
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(hall_id, row_letter, seat_number) -- Prevents duplicate seats in a hall
);

CREATE TABLE showtimes (
    id SERIAL PRIMARY KEY,
    movie_id INT REFERENCES movies(id) ON DELETE CASCADE,
    hall_id INT REFERENCES cinema_halls(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL -- Base price for this specific showing
);