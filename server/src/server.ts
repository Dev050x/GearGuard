import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.routes';
import equipmentRouter from './routes/equipment.routes';
import maintenanceRouter from './routes/maintenance.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/equipment', equipmentRouter);
app.use('/api/maintenance', maintenanceRouter);

app.listen(PORT, () => {
    console.log(`server is listening on ${PORT}`);
});