import express from "express";
import Usuario from "../models/Usuario.js";

const router = express.Router();

// ✅ Cambiar contraseña (texto plano)
router.post("/cambiar-password", async (req, res) => {
  try {
    const { username, actual, nueva } = req.body;

    // Buscar usuario
    const user = await Usuario.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    // Verificar contraseña actual
    if (user.password !== actual) {
      console.log("---",user.password,"-",actual);
      return res.status(400).json({ success: false, message: "Contraseña actual incorrecta" });
    }

    // Actualizar contraseña
    user.password = nueva;
    await user.save();

    return res.json({ success: true, message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    console.error("Error cambiando contraseña:", error);
    return res.status(500).json({ success: false, message: "Error al cambiar contraseña" });
  }
});

export default router;
