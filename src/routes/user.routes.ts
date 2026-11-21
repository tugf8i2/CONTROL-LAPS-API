import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import {
  validateUserActivePayload,
  validateUserPayload,
  validateUserUpdatePayload
} from "../middlewares/validateUser.middleware.js";

const router = Router();

router.get("/consulta", UserController.getAll);
router.post("/registro", validateUserPayload, UserController.create);
router.get("/detalle/:id", UserController.getUserById);
router.patch("/actualiza/:id", validateUserUpdatePayload, UserController.update);
router.patch("/estado/:id", validateUserActivePayload, UserController.setActive);
router.delete("/elimina/:id", UserController.remove);

export default router;