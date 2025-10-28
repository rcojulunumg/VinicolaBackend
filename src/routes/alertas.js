import express from "express";
const router = express.Router();

let configAlerta = { tempMin: null, tempMax: null };

router.post("/temperatura", (req, res) => {
  const { tempMin, tempMax } = req.body;

  if (tempMin === undefined || tempMax === undefined) {
    return res.status(400).json({ message: "Faltan parámetros" });
  }

  configAlerta = { tempMin, tempMax };
  console.log("Nueva configuración de alerta:", configAlerta);

  res.json({ message: "Alertas configuradas correctamente" });
});

export default router;
