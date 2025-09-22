// Configuração da API Groq
export const GROQ_CONFIG = {
  // Para produção, use variáveis de ambiente
  // Para desenvolvimento/demo, use a chave mockada
  API_KEY: import.meta.env.VITE_GROQ_API_KEY || 'gsk_demo_key_mock',
  
  // Modelos disponíveis na Groq
  MODELS: {
    GPT_OSS_20B: 'openai/gpt-oss-20b',
    LLAMA_3_2_90B: 'llama3-2-90b-8192-tool-use-preview',
    LLAMA_3_1_70B: 'llama-3.1-70b-versatile',
    LLAMA_3_1_8B: 'llama-3.1-8b-instant',
    MIXTRAL_8X7B: 'mixtral-8x7b-32768',
    GEMMA_7B: 'gemma-7b-it'
  },
  
  // Configurações padrão
  DEFAULT_TEMPERATURE: 1,
  DEFAULT_MAX_COMPLETION_TOKENS: 8192,
  DEFAULT_TOP_P: 1,
  DEFAULT_REASONING_EFFORT: 'medium'
};

// Função para validar se a API key está configurada
export const isGroqConfigured = (): boolean => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  return apiKey && apiKey !== 'gsk_demo_key_mock' && apiKey.length > 10;
};

// Função para obter status da configuração
export const getGroqStatus = () => {
  const isConfigured = isGroqConfigured();
  
  return {
    isConfigured,
    status: isConfigured ? 'active' : 'demo',
    message: isConfigured 
      ? 'API Groq configurada e ativa' 
      : 'Modo demonstração - Configure VITE_GROQ_API_KEY para usar a API real'
  };
};
