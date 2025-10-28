import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Parcela = sequelize.define("Parcela", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dimensiones: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  latitud: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  longitud: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: "parcelas"
});

export default Parcela;
