const express = require('express');
const cors = require('cors');
require('dotenv').config();

const exameRoutes = require('./routes/exameRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', exameRoutes);

// Rota de teste
app.get('/health', (req, res) => {
    res.json({ status: 'OK', servidor: 'Aplicação B - Sistema de Laudos' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Endpoint: http://localhost:${PORT}/api/exames`);
});