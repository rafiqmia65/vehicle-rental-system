import { pool } from "../../config/db";

const getAllUsers = async () => {
  const result = await pool.query(
    `
    SELECT id, name, email, phone, role FROM users
    `
  );

  return result.rows;
};

const updateUserService = async (userId: number, payload: any) => {
  const { name, email, phone, role } = payload;

  const result = await pool.query(
    `
    UPDATE users 
    SET 
      name = COALESCE($1, name),
      email = COALESCE($2, email),
      phone = COALESCE($3, phone),
      role = COALESCE($4, role)
    WHERE id = $5
    RETURNING id, name, email, phone, role
    `,
    [name, email, phone, role, userId]
  );

  return result.rows[0] || null;
};

const deleteUserService = async (userId: number) => {
  // Check for active bookings first
  const bookingCheck = await pool.query(
    `SELECT id FROM bookings WHERE customer_id = $1 AND status = 'booked'`,
    [userId]
  );

  if (bookingCheck.rows.length > 0) {
    return "Cannot delete user with active bookings";
  }

  // Delete user
  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING id`,
    [userId]
  );

  if (!result.rows.length) {
    return null;
  }

  return true;
};

export const userServices = {
  getAllUsers,
  updateUserService,
  deleteUserService,
};
