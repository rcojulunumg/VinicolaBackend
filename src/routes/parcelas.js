import express from "express";
import Parcela from "../models/Parcela.js";

const router = express.Router();

// CU-01 / CP-01: Registrar nueva parcela
router.post("/", async (req, res) => {
  const { nombre, dimensiones, latitud, longitud } = req.body;

  // Validar campos obligatorios
  if (!nombre || !dimensiones || !latitud || !longitud) {
    return res.status(400).json({ message: "Complete campos obligatorios" });
  }

  try {
    const nuevaParcela = await Parcela.create({
      nombre,
      dimensiones,
      latitud,
      longitud,
      activo: true,
    });
    res.json({ message: "Parcela registrada exitosamente", parcela: nuevaParcela });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar parcela" });
  }
});

// CU-02 / CP-03: Consultar parcelas
router.get("/", async (req, res) => {
  const { nombre } = req.query;
  let where = { activo: true };
  if (nombre) {
    where.nombre = nombre;
  }
  const parcelas = await Parcela.findAll({ where });
  res.json(parcelas);
});

// CU-03: Editar parcela
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const parcela = await Parcela.findByPk(id);
  if (!parcela) return res.status(404).json({ message: "Parcela no encontrada" });

  await parcela.update(req.body);
  res.json({ message: "Parcela actualizada", parcela });
});

// CU-04: Eliminar parcela (lógico)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const parcela = await Parcela.findByPk(id);
  if (!parcela) return res.status(404).json({ message: "Parcela no encontrada" });

  await parcela.update({ activo: false });
  res.json({ message: "Parcela eliminada" });
});

export default router;
