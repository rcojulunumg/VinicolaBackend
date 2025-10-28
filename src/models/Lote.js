import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Lote = sequelize.define("Lote", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  codigo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
  },
});

export default Lote;