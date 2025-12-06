import express from "express";
import { roleTokenVerify } from "../../middlewares/roleTokenVerify";
import { bookingControllers } from "./booking.controllers";
import { adminOrSelfVerify } from "../../middlewares/adminOrSelfVerify";

const router = express.Router();

// Customer or Admin can create booking
router.post("/", roleTokenVerify(), bookingControllers.createBooking);

// Get all bookings Admin or customer base
router.get(
  "/",
  roleTokenVerify(),
  bookingControllers.getAllBookings
);

export const bookingRoutes = router;
