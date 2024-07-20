import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { User } from "./users.js";
import { Event } from "./events.js"

export const Itinerary = sequelize.define("Itinerary", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.JSONB,
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
  description: {
    type: DataTypes.STRING,
  }
}, {
  schema: 'planpal', // Specify the schema name here
});

Itinerary.belongsTo(User, { onDelete: "CASCADE" });
Itinerary.hasMany(Event, { onDelete: "CASCADE" });
