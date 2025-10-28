import express from "express";
const router = express.Router();

router.post("/comparar", async (req, res) => {
  const { lotes } = req.body;
  if (!lotes || lotes.length < 3) {
    return res.status(400).json({ error: "Debes seleccionar al menos 3 lotes." });
  }

  // Simular datos de cata
  const comparativo = lotes.map((lote) => ({
    lote,
    puntuacion: (80 + Math.random() * 20).toFixed(1),
    aroma: ["Frutal", "Floral", "Terroso", "Amaderado"][Math.floor(Math.random() * 4)],
    cuerpo: ["Ligero", "Medio", "Completo"][Math.floor(Math.random() * 3)],
    acidez: (3 + Math.random() * 1.5).toFixed(2),
  }));

  // Calcular promedios generales
  const promedio = {
    puntuacion: (
      comparativo.reduce((acc, c) => acc + parseFloat(c.puntuacion), 0) / comparativo.length
    ).toFixed(1),
    acidez: (
      comparativo.reduce((acc, c) => acc + parseFloat(c.acidez), 0) / comparativo.length
    ).toFixed(2),
  };

  res.json({ comparativo, promedio });
});

export default router;