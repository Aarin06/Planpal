import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";

export const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  googleId: {
    type: DataTypes.STRING,
    unique: true
  },
  accessToken: {
    type: DataTypes.STRING,
    unique: true
  },
  refreshToken: {
    type: DataTypes.STRING,
    unique: true
  },profile: {
    type: DataTypes.JSONB
  }
}, {
  schema: 'planpal', // Specify the schema name here
});
