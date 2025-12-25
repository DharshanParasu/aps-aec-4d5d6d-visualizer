import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import dataRoutes from './routes/data';
import graphqlRoutes from './routes/graphql';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
    origin: ['http://localhost:3000', 'https://localhost:3000'],
    credentials: true
}));
app.use(express.json());

// Routes - both /api/auth and /auth for callback compatibility
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);  // For Autodesk callback URL
app.use('/api/data', dataRoutes);
app.use('/api/graphql', graphqlRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
