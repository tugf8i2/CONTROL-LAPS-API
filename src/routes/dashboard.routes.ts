import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/summary", DashboardController.getSummary);
router.get("/rooms/:id", DashboardController.getRoomSummary);
router.get("/incidents", DashboardController.getIncidents);

export default router;