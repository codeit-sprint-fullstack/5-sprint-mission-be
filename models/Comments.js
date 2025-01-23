import { DataTypes } from "sequelize";
import sequelize from "./database.js";
import { defaultValueSchemable } from "sequelize/lib/utils";

export const Comment = sequelize.define("Comment", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  content: { type: DataTypes.TEXT, allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

export default Comment;
