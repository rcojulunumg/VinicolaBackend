import express from "express";
import Usuario from "../models/Usuario.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Usuario.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const esValido = await user.validarPassword(password);

    if (!esValido) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    res.json({
      message: "Login exitoso",
      user: {
        id: user.id,
        username: user.username,
        rol: user.rol,
      },
      success: true
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;