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

export const userServices = {
  getAllUsers,
  updateUserService,
};
