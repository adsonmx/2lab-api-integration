const Exame = require('../modelos/Exame');

// Gerar protocolo: data (YYYYMMDD) + sequencial simples
const gerarProtocolo = () => {
    const data = new Date();
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    const sequencial = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    
    return `${ano}${mes}${dia}${sequencial}`;
};

const criarExame = async (req, res) => {
    try {
        const { paciente, exame, codigoExterno } = req.body;
        
        // Validação básica
        if (!paciente || !paciente.nome) {
            return res.status(400).json({ erro: 'Nome do paciente é obrigatório' });
        }
        
        if (!exame || !exame.tipo) {
            return res.status(400).json({ erro: 'Tipo de exame é obrigatório' });
        }
        
        if (!codigoExterno) {
            return res.status(400).json({ erro: 'Código externo é obrigatório' });
        }
        
        // Gerar protocolo
        const protocolo = gerarProtocolo();
        
        // Salvar no banco
        await Exame.criar(protocolo, req.body);
        
        // Retornar resposta
        res.status(201).json({
            protocolo: protocolo,
            status: 'RECEBIDO',
            data_recebimento: new Date().toISOString(),
            mensagem: 'Pedido recebido com sucesso'
        });
        
    } catch (error) {
        console.error('Erro ao criar exame:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
};

const consultarStatus = async (req, res) => {
    try {
        const { protocolo } = req.params;
        
        const exame = await Exame.buscarPorProtocolo(protocolo);
        
        if (!exame) {
            return res.status(404).json({ erro: 'Protocolo não encontrado' });
        }
        
        res.json({
            protocolo: exame.protocolo,
            status: exame.status,
            paciente: exame.paciente_nome,
            exame: exame.exame_tipo,
            data_recebimento: exame.created_at,
            data_atualizacao: exame.updated_at,
            laudo: exame.laudo_final || null
        });
        
    } catch (error) {
        console.error('Erro ao consultar status:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
};

module.exports = {
    criarExame,
    consultarStatus
};