const express = require('express');
const router = express.Router();
const exameController = require('../controles/controle_exame');

// Rota para criar um novo exame
router.post('/exames', exameController.criarExame);

// Rota para consultar status pelo protocolo
router.get('/exames/:protocolo', exameController.consultarStatus);

module.exports = router;