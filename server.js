import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import studentRoutes from './routes/studentRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import performanceRoutes from './routes/performanceRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { errorHandler, notFound } from './middleware/errors.js';

const app = express();
const port = Number(process.env.PORT) || 5000;
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.disable('x-powered-by');
app.use(cors({ origin: clientOrigin }));
app.use(express.json({ limit: '100kb' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/performance', performanceRoutes);
app.use(notFound);
app.use(errorHandler);

const uri = process.env.MONGO_URI;
if (!uri) { console.error('MONGO_URI is missing. Copy server/.env.example to server/.env and configure it.'); process.exit(1); }
try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log('MongoDB Atlas connected.');
  app.listen(port, () => console.log(`API ready at http://localhost:${port}`));
} catch (error) {
  console.error(`Could not connect to MongoDB: ${error.message}`);
  console.error('Check the Atlas URI, database user, network access IP allowlist, and internet connection.');
  process.exit(1);
}
