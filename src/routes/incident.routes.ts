import { Router } from "express";
import { IncidentController } from "../controllers/incident.controller.js";
import {
  validateIncidentPayload,
  validateIncidentStatusPayload
} from "../middlewares/validateIncident.middleware.js";

const router = Router();

router.post("/", validateIncidentPayload, IncidentController.create);
router.get("/", IncidentController.getAll);
router.get("/:id", IncidentController.getById);
router.patch("/:id/status", validateIncidentStatusPayload, IncidentController.updateStatus);

export default router;