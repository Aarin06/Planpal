import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

export const Event = sequelize.define("Event", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  start: {
    type: DataTypes.STRING,
  },
  end: {
    type: DataTypes.STRING,
  },
  allDay: {
    type: DataTypes.BOOLEAN,
  }
}, {
  schema: 'planpal', // Specify the schema name here
});
