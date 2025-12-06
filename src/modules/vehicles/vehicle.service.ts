import { pool } from "../../config/db";

interface VehiclePayload {
  vehicle_name: string;
  type: string;
  registration_number: string;
  daily_rent_price: number;
  availability_status: string;
}

// Create Vehicle Service
const createVehicleService = async (payload: VehiclePayload) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const result = await pool.query(
    `INSERT INTO vehicles 
      (vehicle_name, type, registration_number, daily_rent_price, availability_status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING 
        id,
        vehicle_name,
        type,
        registration_number,
        daily_rent_price::float AS daily_rent_price,
        availability_status`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return result.rows[0];
};

// Get all Vehicles
const getAllVehiclesService = async () => {
  const result = await pool.query(
    `SELECT 
        id,
        vehicle_name,
        type,
        registration_number,
        daily_rent_price::float AS daily_rent_price,
        availability_status
     FROM vehicles`
  );

  return result.rows;
};

// Get Vehicle by ID
const getVehicleByIdService = async (vehicleId: number) => {
  const result = await pool.query(
    `SELECT 
        id,
        vehicle_name,
        type,
        registration_number,
        daily_rent_price::float AS daily_rent_price,
        availability_status
     FROM vehicles
     WHERE id = $1`,
    [vehicleId]
  );

  return result.rows[0] || null;
};

interface VehicleUpdatePayload {
  vehicle_name?: string;
  type?: string;
  registration_number?: string;
  daily_rent_price?: number;
  availability_status?: string;
}

// Update Vehicle
const updateVehicleService = async (
  vehicleId: number,
  payload: VehicleUpdatePayload
) => {
  const result = await pool.query(
    `
    UPDATE vehicles
    SET 
      vehicle_name = $1,
      type = $2,
      registration_number = $3,
      daily_rent_price = $4,
      availability_status = $5
    WHERE id = $6
    RETURNING 
      id,
      vehicle_name,
      type,
      registration_number,
      daily_rent_price::float AS daily_rent_price,
      availability_status
    `,
    [
      payload.vehicle_name ?? null,
      payload.type ?? null,
      payload.registration_number ?? null,
      payload.daily_rent_price ?? null,
      payload.availability_status ?? null,
      vehicleId,
    ]
  );

  return result.rows[0] || null;
};

// Delete Vehicle only if available
export const deleteVehicleService = async (vehicleId: number) => {
  const check = await pool.query(
    `SELECT availability_status FROM vehicles WHERE id = $1`,
    [vehicleId]
  );

  if (check.rows.length === 0) {
    return null; // Not found
  }

  if (check.rows[0].availability_status === "booked") {
    return "Cannot delete vehicle because it is booked";
  }

  await pool.query(`DELETE FROM vehicles WHERE id = $1`, [vehicleId]);
  return true;
};

export const vehicleServices = {
  createVehicleService,
  getAllVehiclesService,
  getVehicleByIdService,
  updateVehicleService,
  deleteVehicleService,
};
