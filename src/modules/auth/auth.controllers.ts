import { Request, Response } from "express";
import { authServices } from "./auth.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const data = await authServices.createUserService(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: data,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const data = await authServices.loginUserService(email, password);

    // Check if data is string → error
    if (typeof data === "string") {
      return res.status(401).json({
        success: false,
        message: data, 
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: data,
    });
  } catch (err: any) {
    res.status(401).json({
      success: false,
      message: err.message || "Unauthorized",
    });
  }
};

export const authControllers = {
  createUser,
  loginUser,
};
