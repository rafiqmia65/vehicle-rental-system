import express from "express";
import { vehicleControllers } from "./vehicle.controller";
import { roleTokenVerify } from "../../middlewares/roleTokenVerify";

const router = express.Router();

// Get all Vehicles
router.get("/", vehicleControllers.getAllVehicles);

// Get Vehicle by Id
router.get("/:vehicleId", vehicleControllers.getVehicleById);

// Update Vehicle by Id
router.put(
  "/:vehicleId",
  roleTokenVerify("admin"),
  vehicleControllers.updateVehicle
);

// Admin-only route
router.post("/", roleTokenVerify("admin"), vehicleControllers.createVehicle);

// Delete Vehicle
router.delete(
  "/:vehicleId",
  roleTokenVerify("admin"),
  vehicleControllers.deleteVehicle
);

export const vehicleRoutes = router;
