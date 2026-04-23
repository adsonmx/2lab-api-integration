const db = require('../config/database');

class Exame {
    static async criar(protocolo, dados) {
        const { paciente, exame, codigoExterno } = dados;
        
        const query = `
            INSERT INTO pedidos_exames 
            (protocolo, paciente_nome, paciente_cpf, paciente_data_nascimento, 
             paciente_convenio, paciente_carteirinha, exame_tipo, exame_regiao,
             prioridade, medico_solicitante, medico_crm, observacoes, codigo_externo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const values = [
            protocolo,
            paciente.nome,
            paciente.cpf || null,
            paciente.data_nascimento || null,
            paciente.convenio || null,
            paciente.numero_carteirinha || null,
            exame.tipo,
            exame.regiao || null,
            exame.prioridade || 'NORMAL',
            exame.medico_solicitante || null,
            exame.crm || null,
            dados.observacoes || null,
            codigoExterno
        ];
        
        const [result] = await db.execute(query, values);
        return result;
    }
    
    static async buscarPorProtocolo(protocolo) {
        const query = 'SELECT * FROM pedidos_exames WHERE protocolo = ?';
        const [rows] = await db.execute(query, [protocolo]);
        return rows[0];
    }
    
    static async atualizarStatus(protocolo, status, laudo = null) {
        let query = 'UPDATE pedidos_exames SET status = ?';
        const values = [status];
        
        if (laudo) {
            query += ', laudo_final = ?';
            values.push(laudo);
        }
        
        query += ' WHERE protocolo = ?';
        values.push(protocolo);
        
        const [result] = await db.execute(query, values);
        return result;
    }
}

module.exports = Exame;