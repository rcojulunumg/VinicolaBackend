import express from "express";
const router = express.Router();

// Generar datos aleatorios del dashboard
router.get("/", (req, res) => {
  const temperaturaPromedio = (18 + Math.random() * 10).toFixed(1);
  const humedadPromedio = (45 + Math.random() * 20).toFixed(1);
  const totalUvas = Math.floor(8000 + Math.random() * 5000);
  const azucarPromedio = (20 + Math.random() * 4).toFixed(1);
  const parcelasOptimas = (60 + Math.random() * 40).toFixed(0);

  const produccionMensual = Array.from({ length: 6 }, (_, i) => ({
    mes: `Mes ${i + 1}`,
    produccion: Math.floor(500 + Math.random() * 700),
  }));

  res.json({
    temperaturaPromedio,
    humedadPromedio,
    totalUvas,
    azucarPromedio,
    parcelasOptimas,
    produccionMensual,
    fecha: new Date().toISOString(),
  });
});

export default router;