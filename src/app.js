import express, { json } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();



//import { notFound, errorHandler } from './middlewares.js';
import userRoutes from './api/user/user.routes.js';
import jobRoutes from './api/job/job.routes.js'
import savedHistoryRoutes from './api/saved_history/saved_history.routes.js';
import connectDB from './db.js';
const app = express();
connectDB();
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(json());

app.use('/user', userRoutes);
app.use('/job',jobRoutes);
app.use('/savedhistory',savedHistoryRoutes)
//app.use(notFound);
//app.use(errorHandler);

export default app;
