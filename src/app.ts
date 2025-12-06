import express, { Request, Response } from "express";
import { authRoutes } from "./modules/auth/auth.routes";
import initDB from "./config/db";
import { vehicleRoutes } from "./modules/vehicles/vehicle.routes";
import { userRoutes } from "./modules/user/user.routes";
import { bookingRoutes } from "./modules/bookings/booking.routes";

const app = express();

app.use(express.json());

// initializing DB
initDB();

// "/" -> localhost:5000/
app.get("/", (req: Request, res: Response) => {
  res.send({
    success: true,
    message: "Vehicle Rental System app running",
  });
});

// Auth Routes
app.use("/api/v1/auth", authRoutes);

// Vehicles Routes
app.use("/api/v1/vehicles", vehicleRoutes);

// User Routes
app.use("/api/v1/users", userRoutes);

// Bookings Routes
app.use("/api/v1/bookings", bookingRoutes);

// Route not found
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app;
