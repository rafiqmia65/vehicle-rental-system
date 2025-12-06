import { pool } from "../../config/db";

const createBookingService = async (payload: any) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const vehicleRes = await pool.query(
    `SELECT id, vehicle_name, daily_rent_price, availability_status
     FROM vehicles WHERE id = $1`,
    [vehicle_id]
  );

  if (!vehicleRes.rows[0]) throw new Error("Vehicle not found");
  const vehicle = vehicleRes.rows[0];

  if (vehicle.availability_status === "booked") {
    throw new Error("Vehicle is not available for booking");
  }

  // Calculate days
  const startDate = new Date(rent_start_date);
  const endDate = new Date(rent_end_date);

  const diffTime = endDate.getTime() - startDate.getTime();
  const days = diffTime / (1000 * 60 * 60 * 24);

  if (days <= 0) throw new Error("End date must be after start date");

  // Calculate price (integer)
  const total_price = Math.round(days * Number(vehicle.daily_rent_price));

  // Insert booking
  const bookingRes = await pool.query(
    `
      INSERT INTO bookings
      (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
      VALUES ($1, $2, $3, $4, $5, 'active')
      RETURNING *
    `,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  const booking = bookingRes.rows[0];

  // Update vehicle status
  await pool.query(
    `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
    [vehicle_id]
  );

  return { booking, vehicle };
};

const getAllBookingsService = async (user: any) => {
  if (user.role === "admin") {
    // Admin: all bookings with customer and vehicle info
    const result = await pool.query(`
      SELECT 
        bookings.id,
        bookings.customer_id,
        bookings.vehicle_id,
        bookings.rent_start_date,
        bookings.rent_end_date,
        bookings.total_price,
        bookings.status,
        users.name,
        users.email,
        vehicles.vehicle_name,
        vehicles.registration_number,
        vehicles.type
      FROM bookings
      JOIN users ON bookings.customer_id = users.id
      JOIN vehicles ON bookings.vehicle_id = vehicles.id
      ORDER BY bookings.id DESC
    `);

    return result.rows.map((row) => ({
      id: row.id,
      customer_id: row.customer_id,
      vehicle_id: row.vehicle_id,
      rent_start_date: row.rent_start_date.toISOString().split("T")[0],
      rent_end_date: row.rent_end_date.toISOString().split("T")[0],
      total_price: Number(row.total_price),
      status: row.status,
      customer: {
        name: row.name,
        email: row.email,
      },
      vehicle: {
        vehicle_name: row.vehicle_name,
        registration_number: row.registration_number,
        type: row.type,
      },
    }));
  } else {
    // Customer: only own bookings
    const result = await pool.query(
      `
      SELECT 
        bookings.id,
        bookings.customer_id,
        bookings.vehicle_id,
        bookings.rent_start_date,
        bookings.rent_end_date,
        bookings.total_price,
        bookings.status,
        vehicles.vehicle_name,
        vehicles.registration_number,
        vehicles.type
      FROM bookings
      JOIN vehicles ON bookings.vehicle_id = vehicles.id
      WHERE bookings.customer_id = $1
      ORDER BY bookings.id DESC
    `,
      [user.id]
    );

    return result.rows.map((row) => ({
      id: row.id,
      customer_id: row.customer_id,
      vehicle_id: row.vehicle_id,
      rent_start_date: row.rent_start_date.toISOString().split("T")[0],
      rent_end_date: row.rent_end_date.toISOString().split("T")[0],
      total_price: Number(row.total_price),
      status: row.status,
      vehicle: {
        vehicle_name: row.vehicle_name,
        registration_number: row.registration_number,
        type: row.type,
      },
    }));
  }
};

export const bookingServices = {
  createBookingService,
  getAllBookingsService,
};
