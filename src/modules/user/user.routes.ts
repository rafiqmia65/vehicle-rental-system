import { Router } from "express";
import { userControllers } from "./user.controller";
import { roleTokenVerify } from "../../middlewares/roleTokenVerify";

const router = Router();

// Get All user Only Admin
router.get("/", roleTokenVerify("admin"), userControllers.getAllUser);

export const userRoutes = router;
