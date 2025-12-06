import express from "express";
import { roleTokenVerify } from "../../middlewares/roleTokenVerify";
import { bookingControllers } from "./booking.controllers";

const router = express.Router();

// Customer or Admin can create booking
router.post("/", roleTokenVerify(), bookingControllers.createBooking);

// Get all bookings Admin or customer base
router.get("/", roleTokenVerify(), bookingControllers.getAllBookings);

// Booking Update
router.put("/:bookingId", roleTokenVerify(), bookingControllers.updateBooking);

export const bookingRoutes = router;
