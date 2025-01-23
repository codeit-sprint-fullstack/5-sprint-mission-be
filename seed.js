import sequelize from "./database.js";
import Product from "./models/Product.js";
import { Article } from "./models/Article.js";
import Comment from "./models/Comments.js";

async function seedDatabase() {
  await sequelize.sync({ force: true });

  await Product.bulkCreate([
    { name: "상품1", description: "설명1", price: 10000, tags: ["tag1"] },
    { name: "상품2", description: "설명2", price: 20000, tags: ["tag2"] },
  ]);

  const article = await Article.create({ title: "게시글1", content: "내용1" });
  await Comment.create({ content: "댓글1", articleId: article.id });
}

seedDatabase()
  .then(() => console.log("데이터베이스 시딩 완료"))
  .catch((err) => console.error("데이터베이스 시딩 실패:", err));
