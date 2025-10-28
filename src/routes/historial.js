import express from "express";
import Lectura from "../models/Lectura.js";

const router = express.Router();

// Obtener últimas lecturas de una parcela
router.get("/:parcelaId", async (req, res) => {
  const { parcelaId } = req.params;

  try {
    const lecturas = await Lectura.findAll({
      where: { parcelaId },
      order: [["timestamp", "DESC"]],
      limit: 20, // últimas 20 lecturas
    });

    res.json(lecturas.reverse()); // invertimos para mostrar de más antigua a más reciente
  } catch (err) {
    console.error("Error al obtener historial:", err);
    res.status(500).json({ error: "Error al obtener historial" });
  }
});

export default router;
