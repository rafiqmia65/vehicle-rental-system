import express from "express";
import { roleTokenVerify } from "../../middlewares/roleTokenVerify";
import { bookingControllers } from "./booking.controllers";

const router = express.Router();

// Customer or Admin can create booking
router.post("/", roleTokenVerify(), bookingControllers.createBooking);

export const bookingRoutes = router;
