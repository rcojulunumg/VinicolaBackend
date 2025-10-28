import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Parcela from "./Parcela.js";

const Lectura = sequelize.define("Lectura", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  temperatura: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  humedad: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Relación: una parcela tiene muchas lecturas
Parcela.hasMany(Lectura, { foreignKey: "parcelaId" });
Lectura.belongsTo(Parcela, { foreignKey: "parcelaId" });

export default Lectura;
