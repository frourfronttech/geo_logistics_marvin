-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone_number VARCHAR(50),
    user_type VARCHAR(10) NOT NULL CHECK (user_type IN ('rider', 'driver')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Vehicles Table
CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER REFERENCES users(id) NOT NULL,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    fuel_type VARCHAR(20) NOT NULL,
    average_fuel_consumption DECIMAL(5, 2) -- e.g., L/100km
);

-- Rides Table
CREATE TABLE rides (
    id SERIAL PRIMARY KEY,
    rider_id INTEGER REFERENCES users(id) NOT NULL,
    driver_id INTEGER REFERENCES users(id),
    pickup_location_id INTEGER NOT NULL,
    destination_location_id INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'accepted', 'in_progress', 'completed', 'cancelled')),
    suggested_fare DECIMAL(10, 2),
    final_fare DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Locations Table
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    address_line1 VARCHAR(255),
    city VARCHAR(100),
    postal_code VARCHAR(20)
);

-- Fuel Prices Table
CREATE TABLE fuel_prices (
    id SERIAL PRIMARY KEY,
    fuel_type VARCHAR(20) NOT NULL,
    price_per_liter DECIMAL(10, 2) NOT NULL,
    city VARCHAR(100),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
