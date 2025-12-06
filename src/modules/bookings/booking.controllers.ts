import { Request, Response } from "express";
import { bookingServices } from "./booking.services";

const formatDate = (dateString: string) => {
  return new Date(dateString).toISOString().split("T")[0];
};

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.createBookingService(req.body);
    const booking = result.booking;

    // Format response data
    const responseData = {
      id: booking.id,
      customer_id: booking.customer_id,
      vehicle_id: booking.vehicle_id,
      rent_start_date: formatDate(booking.rent_start_date),
      rent_end_date: formatDate(booking.rent_end_date),
      total_price: Number(booking.total_price),
      status: booking.status,
      vehicle: {
        vehicle_name: result.vehicle.vehicle_name,
        daily_rent_price: Number(result.vehicle.daily_rent_price),
      },
    };

    // Send response
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: responseData,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const loggedInUser = (req as any).user;
    const bookings = await bookingServices.getAllBookingsService(loggedInUser);

    res.status(200).json({
      success: true,
      message:
        loggedInUser.role === "admin"
          ? "Bookings retrieved successfully"
          : "Your bookings retrieved successfully",
      data: bookings,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = Number(req.params.bookingId);
    const { status } = req.body;
    const loggedInUser = (req as any).user;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const result = await bookingServices.updateBookingService(
      bookingId,
      loggedInUser,
      status
    );

    const booking = result.booking;

    const data: any = {
      id: booking.id,
      customer_id: booking.customer_id,
      vehicle_id: booking.vehicle_id,
      rent_start_date: booking.rent_start_date.toISOString().split("T")[0],
      rent_end_date: booking.rent_end_date.toISOString().split("T")[0],
      total_price: Number(booking.total_price),
      status: booking.status,
    };

    if (result.vehicle) {
      data.vehicle = result.vehicle; // ONLY for admin "returned"
    }

    res.status(200).json({
      success: true,
      message: result.message,
      data: data,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const bookingControllers = {
  createBooking,
  getAllBookings,
  updateBooking,
};
