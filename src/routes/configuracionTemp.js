import express from "express";
import { guardarConfiguracion, obtenerConfiguracion } from "../controllers/configuracionTempController.js";

const router = express.Router();

router.post("/", guardarConfiguracion);
router.get("/", obtenerConfiguracion);

export default router;
