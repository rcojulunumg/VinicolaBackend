import express from "express";
import Lote from "../models/Lote.js";

const router = express.Router();

// Obtener todos los lotes
router.get("/", async (req, res) => {
  try {
    const lotes = await Lote.findAll();
    res.json(lotes);
  } catch (error) {
    console.error("Error obteniendo lotes:", error);
    res.status(500).json({ error: "Error obteniendo los lotes" });
  }
});

// Obtener un lote por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const lote = await Lote.findByPk(id);
    if (!lote) {
      return res.status(404).json({ error: "Lote no encontrado" });
    }
    res.json(lote);
  } catch (error) {
    console.error("Error obteniendo lote:", error);
    res.status(500).json({ error: "Error obteniendo el lote" });
  }
});

export default router;
