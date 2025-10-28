import ConfiguracionTemperatura from "../models/ConfiguracionTemperatura.js";

export const guardarConfiguracion = async (req, res) => {
  try {
    const { tempMin, tempMax } = req.body;

    if (tempMin == null || tempMax == null) {
      return res.status(400).json({ message: "Debe ingresar ambos valores de temperatura" });
    }

    // Verificar si ya hay configuración guardada
    const existente = await ConfiguracionTemperatura.findOne();

    if (existente) {
      await existente.update({ tempMin, tempMax });
      return res.json({ message: "Configuración actualizada correctamente" });
    }

    await ConfiguracionTemperatura.create({ tempMin, tempMax });
    res.json({ message: "Configuración guardada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al guardar configuración" });
  }
};

export const obtenerConfiguracion = async (req, res) => {
  try {
    const config = await ConfiguracionTemperatura.findOne();
    if (!config) {
      return res.status(404).json({ message: "Sin configuración registrada" });
    }
    res.json(config);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener configuración" });
  }
};
