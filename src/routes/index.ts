import { Router } from "express";
import ambienteRoutes from "./ambiente.routes.js";
import equipoRoutes from "./equipo.routes.js";
import userRoutes from "./user.routes.js";
import loanRoutes from "./loan.routes.js";

const router = Router();

router.use("/ambientes", ambienteRoutes);
router.use("/equipos", equipoRoutes);
router.use("/users", userRoutes);
router.use("/loans", loanRoutes);

export default router;