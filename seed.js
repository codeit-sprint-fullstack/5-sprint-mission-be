import Product from "./models/Product.js";
import { Article, Comment } from "./models/Article.js";

async function seedDatabase() {
  await sequelize.sync({ force: true });

  // Product 시딩
  await Product.bulkCreate([
    { name: "상품1", description: "설명1", price: 10000, tags: ["tag1"] },
    { name: "상품2", description: "설명2", price: 20000, tags: ["tag2"] },
  ]);

  // Article과 Comment 시딩
  const article = await Article.create({ title: "게시글1", content: "내용1" });
  await Comment.create({ content: "댓글1", articleId: article.id });
}
seedDatabase();
