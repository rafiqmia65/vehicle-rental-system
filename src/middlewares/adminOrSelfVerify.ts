import { Request, Response, NextFunction } from "express";

export const adminOrSelfVerify = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = (req as any).user;
    const paramId = parseInt(req.params.userId ?? "", 10);

    if (!loggedInUser) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // allow admin
    if (loggedInUser.role === "admin") {
      return next();
    }

    // allow only own profile update
    if (loggedInUser.role === "customer" && loggedInUser.id === paramId) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Forbidden: You can update only your own profile",
    });
  };
};
