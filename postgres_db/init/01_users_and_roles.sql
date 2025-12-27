CREATE TYPE user_status AS ENUM ('active', 'blocked', 'pending');

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'customer', 'admin', 'staff'
    description TEXT
);

-- Insert default roles
INSERT INTO roles (name, description) VALUES 
('customer', 'Regular Moviegoer'),
('admin', 'System administrator'),
('staff', 'Cinema staff');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    role_id INT REFERENCES roles(id) ON DELETE SET NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, 
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    full_name VARCHAR(100),
    status user_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);