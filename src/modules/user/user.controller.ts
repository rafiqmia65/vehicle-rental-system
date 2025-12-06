import { Request, Response } from "express";
import { userServices } from "./user.service";

const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await userServices.getAllUsers();

    if (users.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Users found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId ?? "", 10);
    const loggedInUser = (req as any).user;

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // CUSTOMER cannot update email or role
    if (loggedInUser.role === "customer") {
      delete req.body.email;
      delete req.body.role;
    }

    // EMAIL SHOULD NEVER BE CHANGED
    // If email is in body, block it
    if (req.body.email) {
      return res.status(400).json({
        success: false,
        message: "Email cannot be updated",
      });
    }

    const updatedUser = await userServices.updateUserService(userId, req.body);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId ?? "", 10);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const result = await userServices.deleteUserService(userId);

    // Active booking exists
    if (result === "Cannot delete user with active bookings") {
      return res.status(400).json({
        success: false,
        message: result,
      });
    }

    // Not found
    if (result === null) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Deleted successfully
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

export const userControllers = {
  getAllUser,
  updateUser,
  deleteUser,
};
