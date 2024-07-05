import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

export const Event = sequelize.define("Event", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  allDay: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  }
}, {
  schema: 'planpal', // Specify the schema name here
});
