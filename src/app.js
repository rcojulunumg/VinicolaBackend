import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import parcelasRouter from "./routes/parcelas.js";
import sequelize from "./config/db.js";
import cosechasRouter from "./routes/cosechas.js";
import sensoresRouter from "./routes/sensores.js";
import alertasRouter from "./routes/alertas.js";
import configuracionTempRouter from "./routes/configuracionTemp.js";
import historialRouter from "./routes/historial.js";
import reportesRouter from "./routes/reportes.js";
import dashboardRoutes from "./routes/dashboard.js";
import cataRoutes from "./routes/cata.js";
import lotesRoutes from "./routes/lotes.js";
import catasCompararRoutes from "./routes/catasComparar.js";
import authRoutes from "./routes/auth.js";
import usuarioRoutes from "./routes/usuario.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.get("/", (req, res) => {
  res.send("API Vinícola funcionando correctamente");
});

app.use("/api/parcelas", parcelasRouter);
app.use("/api/cosechas", cosechasRouter);
app.use("/api/sensores", sensoresRouter);
app.use("/api/alertas", alertasRouter);
app.use("/api/configuracion-temperatura", configuracionTempRouter);
app.use("/api/historial", historialRouter);
app.use("/api/reportes", reportesRouter);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/catas", cataRoutes);
app.use("/api/lotes", lotesRoutes);
app.use("/api/catas", catasCompararRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRoutes);

// Conectar base de datos
sequelize
  .authenticate()
  .then(() => console.log("Conexión a MySQL establecida"))
  .catch((err) => console.error("Error de conexión:", err));

// Sincronizar modelos (crear tablas)
sequelize
  .sync({ alter: true })
  .then(() => console.log("Tablas sincronizadas con MySQL"))
  .catch((err) => console.error("Error al sincronizar tablas:", err));

export default app;