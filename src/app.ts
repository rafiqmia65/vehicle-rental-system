import express, { Request, Response } from "express";
import { authRoutes } from "./modules/auth/auth.routes";
import initDB from "./config/db";

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

// Route not found
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app;
