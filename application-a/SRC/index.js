const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3000;
const API_B_URL = process.env.API_B_URL || 'http://localhost:4000/api';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota para servir o formulário
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>ERP Clínica - Envio de Exames</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 800px;
                    margin: 50px auto;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                h1 {
                    color: #333;
                    text-align: center;
                }
                .card {
                    background: white;
                    border-radius: 8px;
                    padding: 20px;
                    margin-bottom: 20px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .card h2 {
                    margin-top: 0;
                    color: #555;
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 10px;
                }
                .form-group {
                    margin-bottom: 15px;
                }
                label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: bold;
                    color: #555;
                }
                input, select, textarea {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    box-sizing: border-box;
                }
                button {
                    background-color: #007bff;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                }
                button:hover {
                    background-color: #0056b3;
                }
                .result {
                    background-color: #e8f4fd;
                    border-left: 4px solid #007bff;
                    padding: 15px;
                    margin-top: 20px;
                    border-radius: 4px;
                }
                .error {
                    background-color: #f8d7da;
                    border-left: 4px solid #dc3545;
                }
                .success {
                    background-color: #d4edda;
                    border-left: 4px solid #28a745;
                }
                pre {
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    margin: 0;
                }
            </style>
        </head>
        <body>
            <h1>🏥 ERP Clínica - Envio de Exames</h1>
            
            <div class="card">
                <h2>📋 Dados do Paciente</h2>
                <form id="exameForm">
                    <div class="form-group">
                        <label>Nome do Paciente *</label>
                        <input type="text" id="paciente_nome" required>
                    </div>
                    <div class="form-group">
                        <label>CPF</label>
                        <input type="text" id="paciente_cpf" placeholder="000.000.000-00">
                    </div>
                    <div class="form-group">
                        <label>Data de Nascimento</label>
                        <input type="date" id="paciente_data_nascimento">
                    </div>
                    <div class="form-group">
                        <label>Convênio</label>
                        <input type="text" id="paciente_convenio" placeholder="Ex: Unimed, Amil, etc">
                    </div>
                    <div class="form-group">
                        <label>Número da Carteirinha</label>
                        <input type="text" id="paciente_carteirinha">
                    </div>
                    
                    <h2>🔬 Dados do Exame</h2>
                    <div class="form-group">
                        <label>Tipo de Exame *</label>
                        <select id="exame_tipo" required>
                            <option value="">Selecione...</option>
                            <option value="Ressonância Magnética">Ressonância Magnética</option>
                            <option value="Tomografia Computadorizada">Tomografia Computadorizada</option>
                            <option value="Ultrassom">Ultrassom</option>
                            <option value="Raio-X">Raio-X</option>
                            <option value="Mamografia">Mamografia</option>
                            <option value="Densitometria Óssea">Densitometria Óssea</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Região do Exame</label>
                        <input type="text" id="exame_regiao" placeholder="Ex: Crânio, Abdômen, Tórax">
                    </div>
                    <div class="form-group">
                        <label>Prioridade</label>
                        <select id="exame_prioridade">
                            <option value="BAIXA">Baixa</option>
                            <option value="NORMAL" selected>Normal</option>
                            <option value="ALTA">Alta</option>
                            <option value="URGENTE">Urgente</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Médico Solicitante</label>
                        <input type="text" id="medico_solicitante" placeholder="Nome do médico">
                    </div>
                    <div class="form-group">
                        <label>CRM do Médico</label>
                        <input type="text" id="medico_crm" placeholder="00000-SP">
                    </div>
                    <div class="form-group">
                        <label>Código Externo *</label>
                        <input type="text" id="codigo_externo" required placeholder="Código de referência do exame">
                    </div>
                    <div class="form-group">
                        <label>Observações</label>
                        <textarea id="observacoes" rows="3"></textarea>
                    </div>
                    
                    <button type="submit">📤 Enviar Pedido</button>
                </form>
            </div>
            
            <div id="resultado" style="display:none;" class="result"></div>

            <script>
                const form = document.getElementById('exameForm');
                const resultadoDiv = document.getElementById('resultado');
                
                form.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    
                    const dados = {
                        paciente: {
                            nome: document.getElementById('paciente_nome').value,
                            cpf: document.getElementById('paciente_cpf').value || null,
                            data_nascimento: document.getElementById('paciente_data_nascimento').value || null,
                            convenio: document.getElementById('paciente_convenio').value || null,
                            numero_carteirinha: document.getElementById('paciente_carteirinha').value || null
                        },
                        exame: {
                            tipo: document.getElementById('exame_tipo').value,
                            regiao: document.getElementById('exame_regiao').value || null,
                            prioridade: document.getElementById('exame_prioridade').value,
                            medico_solicitante: document.getElementById('medico_solicitante').value || null,
                            crm: document.getElementById('medico_crm').value || null
                        },
                        codigoExterno: document.getElementById('codigo_externo').value,
                        observacoes: document.getElementById('observacoes').value || null
                    };
                    
                    resultadoDiv.style.display = 'block';
                    resultadoDiv.innerHTML = '<div class="result">⏳ Enviando pedido...</div>';
                    resultadoDiv.className = 'result';
                    
                    try {
                        const response = await fetch('/enviar', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(dados)
                        });
                        
                        const data = await response.json();
                        
                        if (response.ok) {
                            resultadoDiv.innerHTML = \`
                                <div class="result success">
                                    <strong>✅ Pedido enviado com sucesso!</strong><br>
                                    <strong>Protocolo:</strong> \${data.protocolo}<br>
                                    <strong>Status:</strong> \${data.status}<br>
                                    <strong>Data:</strong> \${new Date(data.data_recebimento).toLocaleString()}<br>
                                    <strong>Mensagem:</strong> \${data.mensagem}
                                </div>
                            \`;
                            form.reset();
                        } else {
                            resultadoDiv.innerHTML = \`
                                <div class="result error">
                                    <strong>❌ Erro ao enviar pedido:</strong><br>
                                    \${data.erro || 'Erro desconhecido'}
                                </div>
                            \`;
                        }
                    } catch (error) {
                        resultadoDiv.innerHTML = \`
                            <div class="result error">
                                <strong>❌ Erro de conexão:</strong><br>
                                \${error.message}
                            </div>
                        \`;
                    }
                });
            </script>
        </body>
        </html>
    `);
});

// Rota para processar o envio
app.post('/enviar', async (req, res) => {
    try {
        const response = await axios.post(`${API_B_URL}/exames`, req.body);
        res.status(201).json(response.data);
    } catch (error) {
        console.error('Erro ao enviar:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { erro: 'Erro ao enviar pedido' });
    }
});

// Rota para consultar status pelo protocolo (opcional)
app.get('/status/:protocolo', async (req, res) => {
    try {
        const response = await axios.get(`${API_B_URL}/exames/${req.params.protocolo}`);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { erro: 'Erro ao consultar status' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Aplicação A - ERP Simulator rodando na porta ${PORT}`);
    console.log(`📋 Acesse: http://localhost:${PORT}`);
    console.log(`🔗 API B configurada em: ${API_B_URL}`);
});