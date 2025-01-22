import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const PORT = 3000

import errorHandler from './lib/errorHandler.js';
import articleRoutes from './routes/articles.js';
import commentRoutes from './routes/comments.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/articles', articleRoutes);
app.use('/comments', commentRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`서버돌아간다얍얍얍:${PORT}`);
});

export default app;