import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ConfiguracionTemperatura = sequelize.define("ConfiguracionTemperatura", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tempMin: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  tempMax: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  tableName: "configuracion_temperatura",
});

export default ConfiguracionTemperatura;
