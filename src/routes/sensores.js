import express from "express";
import ConfiguracionTemperatura from "../models/ConfiguracionTemperatura.js";
import Lectura from "../models/Lectura.js";

const router = express.Router();

router.get("/:parcelaId", async (req, res) => {
  try {
    const { parcelaId } = req.params;

    // Simular datos dinámicos
    const temperatura = (20 + Math.random() * 10).toFixed(1); // 20 a 30
    const humedad = (40 + Math.random() * 20).toFixed(1); // 40 a 60

    // Obtener configuración global (solo 1 registro)
    const config = await ConfiguracionTemperatura.findOne();

    let alerta = null;

    if (config) {
      const temp = parseFloat(temperatura);
      if (temp < config.tempMin || temp > config.tempMax) {
        alerta = `⚠️ Temperatura fuera de rango (${temperatura}°C). 
                  Rango permitido: ${config.tempMin}°C - ${config.tempMax}°C`;
      }
    }

    // Guardar en BD
    await Lectura.create({
      parcelaId,
      temperatura,
      humedad,
    });

    res.json({
      parcelaId,
      temperatura,
      humedad,
      alerta,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error al obtener datos del sensor:", error);
    res.status(500).json({ message: "Error al obtener datos del sensor" });
  }
});

export default router;
