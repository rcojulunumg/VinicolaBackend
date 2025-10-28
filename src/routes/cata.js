import express from "express";
import Cata from "../models/Cata.js";
import Lote from "../models/Lote.js";

const router = express.Router();

// 🟢 Crear nueva cata
router.post("/", async (req, res) => {
  try {
    const { loteId, puntuacion, notas } = req.body;

    if (puntuacion < 0 || puntuacion > 100)
      return res.status(400).json({ error: "Puntuación debe ser entre 0-100" });

    const lote = await Lote.findByPk(loteId);
    if (!lote) return res.status(404).json({ error: "Lote no encontrado" });

    const nuevaCata = await Cata.create({ loteId, puntuacion, notas });
    res.json({ message: "Cata registrada correctamente", cata: nuevaCata });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al registrar cata" });
  }
});

//  Listar catas
router.get("/", async (req, res) => {
  try {
    const catas = await Cata.findAll({
      include: { model: Lote, attributes: ["codigo"] },
      order: [["createdAt", "DESC"]],
    });
    res.json(catas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener catas" });
  }
});

//  Editar cata existente
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { puntuacion, notas, loteId } = req.body;

    if (puntuacion < 0 || puntuacion > 100)
      return res.status(400).json({ error: "Puntuación debe ser entre 0-100" });

    const cata = await Cata.findByPk(id);
    if (!cata) return res.status(404).json({ error: "Cata no encontrada" });

    cata.puntuacion = puntuacion;
    cata.notas = notas;
    cata.loteId = loteId;
    await cata.save();

    res.json({ message: "Cata actualizada correctamente", cata });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar cata" });
  }
});

export default router;
