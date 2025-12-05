import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service";

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await vehicleServices.createVehicleService(req.body);

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: vehicle,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await vehicleServices.getAllVehiclesService();

    if (vehicles.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No vehicles found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: vehicles,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

const getVehicleById = async (req: Request, res: Response) => {
  try {
    const vehicleId = parseInt(req.params.vehicleId ?? "", 10);

    if (isNaN(vehicleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle ID",
      });
    }

    const vehicle = await vehicleServices.getVehicleByIdService(vehicleId);

    if (!vehicle) {
      return res.status(404).json({
        success: true,
        message: "Vehicle not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: vehicle,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleId = parseInt(req.params.vehicleId ?? "", 10);

    if (isNaN(vehicleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle ID",
      });
    }

    const updatedVehicle = await vehicleServices.updateVehicleService(
      vehicleId,
      req.body
    );

    if (!updatedVehicle) {
      return res.status(404).json({
        success: true,
        message: "Vehicle not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: updatedVehicle,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleId = parseInt(req.params.vehicleId ?? "", 10);

    if (isNaN(vehicleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle ID",
      });
    }

    const result = await vehicleServices.deleteVehicleService(vehicleId);

    if (result === null) {
      return res.status(404).json({
        success: true,
        message: "Vehicle not found",
      });
    }

    if (typeof result === "string") {
      return res.status(400).json({
        success: false,
        message: result,
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

export const vehicleControllers = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
