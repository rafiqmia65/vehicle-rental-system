import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import jwt from "jsonwebtoken";
import config from "../../config/config";

const createUserService = async (payload: Record<string, unknown>) => {
  const { name, role, email, password, phone, id } = payload;

  // Password Hash
  const hashedPass = await bcrypt.hash(password as string, 10);

  // Insert user in db
  const result = await pool.query(
    `
    INSERT INTO users (name, email, password, phone, role)
    VALUES($1, $2, $3, $4, $5)
    RETURNING id, name, email, phone, role
    `,
    [name, email, hashedPass, phone, role]
  );

  return result.rows[0];
};

const loginUserService = async (email: string, password: string) => {
  // Check user
  const result = await pool.query(
    `SELECT id, name, email, password, phone, role FROM users WHERE email=$1`,
    [email]
  );

  if (result.rows.length === 0) {
    return "Invalid email or password";
  }

  const user = result.rows[0];

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return "Invalid email or password";

  // Create token
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    config.jwt_secret as string,
    { expiresIn: "10d" }
  );

  // 4. Remove password from user object before returning
  const { password: _, ...userWithoutPassword } = user;

  return { token, user: userWithoutPassword };
};

export const authServices = {
  createUserService,
  loginUserService,
};
