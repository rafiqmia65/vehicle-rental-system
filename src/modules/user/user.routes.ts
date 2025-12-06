import { Router } from "express";
import { userControllers } from "./user.controller";
import { roleTokenVerify } from "../../middlewares/roleTokenVerify";
import { adminOrSelfVerify } from "../../middlewares/adminOrSelfVerify";

const router = Router();

// Get All user Only Admin
router.get("/", roleTokenVerify("admin"), userControllers.getAllUser);

// Update User (Admin or Own)
router.put(
  "/:userId",
  roleTokenVerify(),
  adminOrSelfVerify(),
  userControllers.updateUser
);

// Delete User (Admin only)
router.delete("/:userId", roleTokenVerify("admin"), userControllers.deleteUser);

export const userRoutes = router;
