import { groqService } from './groqService';

// Documentos do projeto para contextualização
const PROJECT_DOCUMENTS = {
  'relatorio': `
    # Conecta60+: Inclusão Digital Simples e Segura para Idosos
    
    ## Objetivo
    Desenvolver um aplicativo móvel simplificado para idosos com funções integradas de saúde, finanças e comunicação, com interface acessível e recursos de segurança.
    
    ## Público-Alvo
    - Idosos com dificuldades tecnológicas
    - Persona principal: Clóvis Silva, 63 anos, aposentado
    - Necessidades: interface simples, segurança, suporte humano
    
    ## Módulos Principais
    1. **Módulo de Saúde**: Agenda médica, lembretes de medicamentos, histórico de consultas, contatos de emergência
    2. **Módulo de Comunicação**: Chamadas de vídeo, envio de fotos, mensagens de voz, contatos favoritos
    3. **Módulo de Finanças**: Pagamentos simplificados, extratos claros, transações seguras
    
    ## Características de Interface
    - Botões grandes e bem espaçados
    - Ícones claros e intuitivos
    - Navegação simplificada
    - Contraste adequado para visão
    - Feedback sonoro e visual
  `,
  
  'contexto': `
    ## Contexto do Projeto Conecta60+
    
    O projeto foi desenvolvido para resolver a exclusão digital da população idosa brasileira.
    
    ### Principais Desafios
    - Exclusão digital crescente
    - Barreiras em serviços essenciais (governo, saúde, bancos)
    - Medo de golpes digitais
    - Isolamento social
    - Dependência externa para tarefas digitais
    
    ### Persona Principal - Clóvis Silva
    - 63 anos, aposentado, casado
    - Ensino médio incompleto
    - Renda familiar: R$ 1.500 - R$ 3.500
    - Objetivos: autonomia, harmonia familiar, qualidade de vida
    - Dores: dificuldade com tecnologia, medo de golpes, isolamento social
    
    ### Proposta de Valor
    Solução integrada que combina simplicidade, segurança e suporte humano para empoderar idosos digitalmente.
  `,
  
  'hipoteses': `
    ## Hipóteses do Projeto Conecta60+
    
    ### Hipóteses de Alta Prioridade
    1. **Interface Simples**: Se o app tiver interface simples com botões grandes e ícones claros, então Clóvis conseguirá usar com autonomia
    2. **Segurança Digital**: Se houver recursos de segurança acessíveis e visíveis, então Clóvis terá menos medo de golpes digitais
    
    ### Hipóteses de Média Prioridade
    3. **Comunicação Familiar**: Se o app permitir comunicação fácil com filhos e netos, então haverá redução do isolamento social
    4. **Centralização de Serviços**: Se os serviços forem centralizados em um só lugar, então Clóvis dependerá menos de ajuda externa
    5. **Suporte Humano**: Se houver suporte humano disponível, então Clóvis terá maior confiança para usar o aplicativo
    6. **Lembretes Médicos**: Se houver lembretes visuais e sonoros, então haverá redução de faltas médicas
  `,
  
  'funcionalidades': `
    ## Funcionalidades do Conecta60+
    
    ### Módulo de Saúde
    - **Agenda Médica**: Visualização simples de consultas agendadas
    - **Lembretes de Medicamentos**: Notificações visuais e sonoras
    - **Histórico de Consultas**: Registro organizado de atendimentos
    - **Contatos de Emergência**: Acesso rápido a números importantes
    - **Informações de Saúde**: Dados médicos organizados
    
    ### Módulo de Comunicação
    - **Chamadas de Vídeo**: Interface simplificada para videochamadas
    - **Envio de Fotos**: Compartilhamento fácil de imagens
    - **Mensagens de Voz**: Gravação e envio de áudios
    - **Contatos Favoritos**: Lista de pessoas importantes
    - **Notificações**: Alertas de mensagens recebidas
    
    ### Módulo de Finanças
    - **Pagamentos**: Transações simplificadas e seguras
    - **Extratos**: Visualização clara de movimentações
    - **Cartões**: Gestão de cartões de crédito e débito
    - **Poupança**: Acompanhamento de investimentos básicos
  `
};

// FAQ básico do sistema
const FAQ_DATABASE = {
  'login': {
    pergunta: 'Como fazer login no aplicativo?',
    resposta: 'Para fazer login, toque no botão "Entrar" na tela inicial, digite seu CPF e senha, depois toque em "Confirmar". Se for a primeira vez, você precisará criar uma conta seguindo o processo de cadastro.',
    categoria: 'autenticacao'
  },
  'senha': {
    pergunta: 'Esqueci minha senha, como recuperar?',
    resposta: 'Se esqueceu sua senha, toque em "Esqueci minha senha" na tela de login, digite seu CPF e siga as instruções que enviaremos por SMS ou e-mail. Você receberá um link para criar uma nova senha.',
    categoria: 'autenticacao'
  },
  'agendar': {
    pergunta: 'Como agendar uma consulta médica?',
    resposta: 'Para agendar uma consulta, vá em "Saúde" > "Agendar Consulta", escolha a especialidade desejada, selecione data e horário disponível. Você receberá um lembrete antes da consulta.',
    categoria: 'saude'
  },
  'medicamento': {
    pergunta: 'Como configurar lembretes de medicamento?',
    resposta: 'Para configurar lembretes, vá em "Saúde" > "Medicamentos" > "Adicionar Lembrete". Configure o nome do medicamento, horário e frequência. Você receberá notificações visuais e sonoras.',
    categoria: 'saude'
  },
  'contato': {
    pergunta: 'Como adicionar contato de emergência?',
    resposta: 'Para adicionar contatos de emergência, vá em "Configurações" > "Contatos de Emergência" e adicione o nome e telefone da pessoa. Estes contatos aparecerão em situações de emergência.',
    categoria: 'configuracao'
  },
  'video': {
    pergunta: 'Como fazer uma chamada de vídeo?',
    resposta: 'Para fazer chamada de vídeo, vá em "Comunicação" > "Chamadas", escolha o contato desejado e toque no ícone de vídeo. A chamada será iniciada automaticamente.',
    categoria: 'comunicacao'
  },
  'foto': {
    pergunta: 'Como enviar uma foto?',
    resposta: 'Para enviar uma foto, vá em "Comunicação" > "Mensagens", escolha o contato, toque no ícone da câmera, tire a foto ou escolha uma da galeria, e toque em "Enviar".',
    categoria: 'comunicacao'
  },
  'pagamento': {
    pergunta: 'Como fazer um pagamento?',
    resposta: 'Para fazer pagamentos, vá em "Finanças" > "Pagamentos", escolha o tipo de pagamento (conta, cartão, etc.), preencha os dados solicitados e confirme a transação.',
    categoria: 'financas'
  }
};

export class SupportService {
  /**
   * Busca informações nos documentos do projeto
   */
  static async searchInProjectDocs(query: string): Promise<string> {
    const lowerQuery = query.toLowerCase();
    
    // Busca por palavras-chave específicas
    for (const [key, faq] of Object.entries(FAQ_DATABASE)) {
      if (lowerQuery.includes(key) || 
          lowerQuery.includes(faq.pergunta.toLowerCase()) ||
          faq.pergunta.toLowerCase().includes(lowerQuery)) {
        return faq.resposta;
      }
    }
    
    // Busca por categoria
    const categories = {
      'saude': ['saúde', 'médico', 'consulta', 'medicamento', 'remédio', 'hospital'],
      'comunicacao': ['chamada', 'vídeo', 'foto', 'mensagem', 'contato', 'família'],
      'financas': ['pagamento', 'conta', 'cartão', 'dinheiro', 'banco', 'transação'],
      'autenticacao': ['login', 'senha', 'entrar', 'cadastro', 'conta'],
      'configuracao': ['configurar', 'ajustar', 'definir', 'preferências']
    };
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerQuery.includes(keyword))) {
        const categoryFaqs = Object.values(FAQ_DATABASE).filter(faq => faq.categoria === category);
        if (categoryFaqs.length > 0) {
          return `Sobre ${category}, posso ajudá-lo com:\n\n` + 
                 categoryFaqs.map(faq => `• ${faq.pergunta}`).join('\n') +
                 '\n\nQual dessas opções se relaciona com sua dúvida?';
        }
      }
    }
    
    // Se não encontrar resposta específica, usar LLM
    return await this.getLLMResponse(query);
  }
  
  /**
   * Integração com LLM (Groq) para respostas contextuais
   */
  static async getLLMResponse(query: string): Promise<string> {
    try {
      const context = `
        Você é o assistente virtual do Conecta60+, um aplicativo desenvolvido para inclusão digital de idosos.
        
        CONTEXTO DO PROJETO:
        ${PROJECT_DOCUMENTS.relatorio}
        
        ${PROJECT_DOCUMENTS.contexto}
        
        ${PROJECT_DOCUMENTS.hipoteses}
        
        ${PROJECT_DOCUMENTS.funcionalidades}
        
        INSTRUÇÕES:
        - Responda de forma clara, simples e amigável, como se estivesse falando com um idoso
        - Use linguagem acessível, evite termos técnicos complexos
        - Seja paciente e didático nas explicações
        - Se a pergunta for muito específica sobre funcionalidades técnicas, sugira entrar em contato com suporte humano
        - Sempre ofereça ajuda adicional
        - Mantenha o tom acolhedor e compreensivo
        
        Pergunta do usuário: "${query}"
      `;
      
      const response = await groqService.generateResponse(context);
      return response;
    } catch (error) {
      console.error('Erro ao gerar resposta com LLM:', error);
      return 'Desculpe, não consegui processar sua pergunta no momento. Tente novamente ou entre em contato com nosso suporte humano que está disponível 24/7. Posso ajudá-lo com mais alguma coisa?';
    }
  }
  
  /**
   * Busca FAQ por categoria
   */
  static getFAQByCategory(category: string) {
    return Object.values(FAQ_DATABASE).filter(faq => faq.categoria === category);
  }
  
  /**
   * Busca FAQ por palavra-chave
   */
  static searchFAQ(keyword: string) {
    const lowerKeyword = keyword.toLowerCase();
    return Object.values(FAQ_DATABASE).filter(faq => 
      faq.pergunta.toLowerCase().includes(lowerKeyword) ||
      faq.resposta.toLowerCase().includes(lowerKeyword)
    );
  }
  
  /**
   * Obtém todas as categorias disponíveis
   */
  static getCategories() {
    return [...new Set(Object.values(FAQ_DATABASE).map(faq => faq.categoria))];
  }
  
  /**
   * Obtém FAQ completo
   */
  static getAllFAQ() {
    return Object.values(FAQ_DATABASE);
  }
}
