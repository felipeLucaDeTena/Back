import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { mongoConnect } from './services/db.js';

import usersRouter from './routes/users.routes.js';
import itemsRouter from './routes/items.routes.js';
import collectionsRouter from './routes/collections.routes.js';
import authRouter from './routes/auth.routes.js';
import helmet from 'helmet';

dotenv.config();
mongoConnect();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/items', itemsRouter);
app.use('/collections', collectionsRouter);

app.use('/', (err, req, res, next) => {
    res.status(500).json({ err });
});

app.listen(port, () => {
    console.log(`Server listening in http://localhost:${port}`);
});
