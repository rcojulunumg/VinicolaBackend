import express from "express";
const router = express.Router();

// Endpoint para analizar madurez de la uva
router.post("/analizar", (req, res) => {
  const { azucar, acidez } = req.body;

  if (azucar == null || acidez == null) {
    return res.status(400).json({ mensaje: "Debe ingresar azúcar y acidez" });
  }

  let recomendacion = "";

  // Lógica simple para la prueba:
  if (azucar >= 24 && acidez <= 6) {
    recomendacion = "Uva lista para cosecha inmediata 🍇";
  } else if (azucar >= 22 && acidez <= 6.5) {
    recomendacion = "Cosecha recomendada en 7 días";
  } else {
    recomendacion = "Esperar maduración adicional (10-14 días)";
  }

  return res.json({ recomendacion });
});


router.post("/programar", (req, res) => {
  const { parcelaId, fecha } = req.body;

  if (!fecha) {
    return res.status(400).json({ mensaje: "Debe ingresar una fecha" });
  }

  const fechaIngresada = new Date(fecha);
  const hoy = new Date();

  if (fechaIngresada < hoy.setHours(0, 0, 0, 0)) {
    return res.status(400).json({ mensaje: "Fecha no válida" });
  }

  // Si pasa las validaciones
  return res.json({ mensaje: "Cosecha programada correctamente" });
});

export default router;
