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

export const bookingControllers = {
  createBooking,
};
