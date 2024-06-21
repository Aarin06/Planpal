import { sequelize } from "../datasource.js";
import { DataTypes } from "sequelize";
import { User } from "./users.js";

export const Message = sequelize.define("Message", {
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  upvote: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  downvote: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

Message.belongsTo(User);
User.hasMany(Message);
