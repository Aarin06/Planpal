import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { Itinerary } from "./itineraries.js";
import { User } from "./users.js";

export const ItineraryMember = sequelize.define(
  "ItineraryMember",
  {},
  {
    schema: "planpal", // Specify the schema name here
  },
);

ItineraryMember.belongsTo(Itinerary, {
  foreignKey: "ItineraryId",
  onDelete: "CASCADE",
});
ItineraryMember.belongsTo(User, { foreignKey: "UserId", onDelete: "CASCADE" });
