import { Pool } from "pg";
import config from "./config";

export const pool = new Pool({
  connectionString: `${config.connection_str}`,
});

const initDB = async () => {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password TEXT NOT NULL CHECK (LENGTH(password) >= 6),
        phone VARCHAR(20) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'customer'))
        )
        `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(100) NOT NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
        registration_number VARCHAR(50) NOT NULL UNIQUE,
        daily_rent_price NUMERIC(10, 2) NOT NULL CHECK (daily_rent_price > 0),
        availability_status VARCHAR(20) NOT NULL CHECK (availability_status IN ('available', 'booked'))
    )
    `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    
    customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,

    rent_start_date DATE NOT NULL,
    rent_end_date DATE NOT NULL CHECK (rent_end_date > rent_start_date),

    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price > 0),

    status VARCHAR(20) NOT NULL 
        CHECK (status IN ('active', 'cancelled', 'returned'))
    )
`)  
};

export default initDB;
