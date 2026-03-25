
Ferramenta para testar 2 API s via webservice, usando alguma autentiicação 

# 2LAB API Integration

**Aplicação A** (ERP da Clínica) → **Aplicação B** (Sistema de Laudos)

### Como funciona

1. **Aplicação A** envia para **Aplicação B**:
   - Dados do paciente
   - Dados do exame
   - Código externo (identificador do exame na B)

2. **Aplicação B**:
   - Valida os dados recebidos
   - Gera um protocolo único
   - Salva no MySQL
   - Retorna o protocolo para a A

3. **Aplicação A** pode consultar o status do exame a qualquer momento via API

### Comunicação
- REST API síncrona
- Formato: JSON


### Tecnologias
- Node.js
- AWS Lambda + API Gateway
- Amazon RDS (MySQL)
- Git

