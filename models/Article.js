import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import Comment from "./Comments.js";

const Article = sequelize.define(
  "Article",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    freezeTableName: true,
  }
);

Article.hasMany(Comment, { foreignKey: "articleId", onDelete: "CASCADE" });
Comment.belongsTo(Article, { foreignKey: "articleId" });

export default Article;
