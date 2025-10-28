import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Lote from "./Lote.js";

const Cata = sequelize.define("Cata", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  puntuacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  notas: {
    type: DataTypes.TEXT,
  },
});

Lote.hasMany(Cata, { foreignKey: "loteId" });
Cata.belongsTo(Lote, { foreignKey: "loteId" });

export default Cata;
