const sequelize = require("./config/db");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a MySQL exitosa.");
  } catch (error) {
    console.error("❌ Error de conexión:", error);
  } finally {
    process.exit();
  }
})();