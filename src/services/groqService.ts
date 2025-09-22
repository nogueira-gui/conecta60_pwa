import { Groq } from 'groq-sdk';
import { AIAssistantMessage } from '../types/communication';
import { GROQ_CONFIG } from '../config/groq';

// Configuração da API Groq
const groq = new Groq({
  apiKey: GROQ_CONFIG.API_KEY,
  dangerouslyAllowBrowser: true
});

export interface GroqChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GroqChatContext {
  patientName?: string;
  patientAge?: number;
  healthConditions?: string[];
  recentAppointments?: string[];
  medications?: string[];
  familyContext?: string;
}

class GroqService {
  private systemPrompt = `
    Você é um assistente virtual especializado em cuidados com idosos para a plataforma Conecta60+.
    
    Suas características:
    - Linguagem simples, carinhosa e respeitosa
    - Foco na saúde e bem-estar de pessoas idosas
    - Ajuda com lembretes médicos, medicamentos e consultas
    - Oferece companhia e conversa amigável
    - Orienta sobre cuidados básicos de saúde
    - Incentiva atividades físicas e mentais apropriadas
    
    IMPORTANTE:
    - NUNCA substitua conselhos médicos profissionais
    - Sempre sugira consultar médicos para questões de saúde
    - Seja paciente e repita informações quando necessário
    - Use linguagem acessível para idosos
    - Mantenha um tom positivo e encorajador
  `;

  async generateResponse(
    userMessage: string, 
    context?: GroqChatContext,
    onStream?: (chunk: string) => void
  ): Promise<AIAssistantMessage> {
    try {
      // Construir contexto personalizado se fornecido
      let contextualPrompt = this.systemPrompt;
      
      if (context) {
        contextualPrompt += `\n\nContexto do paciente:
        ${context.patientName ? `Nome: ${context.patientName}` : ''}
        ${context.patientAge ? `Idade: ${context.patientAge} anos` : ''}
        ${context.healthConditions?.length ? `Condições de saúde: ${context.healthConditions.join(', ')}` : ''}
        ${context.medications?.length ? `Medicamentos: ${context.medications.join(', ')}` : ''}
        ${context.familyContext ? `Contexto familiar: ${context.familyContext}` : ''}
        `;
      }

      const messages: GroqChatMessage[] = [
        {
          role: 'system',
          content: contextualPrompt
        },
        {
          role: 'user',
          content: userMessage
        }
      ];

      // Se streaming está habilitado, usar streaming
      if (onStream) {
        return this.generateStreamingResponse(messages, context, onStream);
      }

      // Resposta não-streaming
      const chatCompletion = await groq.chat.completions.create({
        messages,
        model: GROQ_CONFIG.MODELS.GPT_OSS_20B,
        temperature: GROQ_CONFIG.DEFAULT_TEMPERATURE,
        max_tokens: GROQ_CONFIG.DEFAULT_MAX_COMPLETION_TOKENS,
        top_p: GROQ_CONFIG.DEFAULT_TOP_P,
        stream: false,
        stop: null
      });

      const response = chatCompletion.choices[0]?.message?.content || 
        'Desculpe, não consegui processar sua mensagem. Tente novamente.';

      return {
        id: `ai_${Date.now()}`,
        content: response,
        timestamp: new Date(),
        type: 'text',
        context: context ? {
          patientInfo: context,
          healthStatus: 'monitoring',
          recentActivities: []
        } : undefined
      };

    } catch (error) {
      console.error('Erro na API Groq:', error);
      
      // Fallback para resposta mockada em caso de erro
      return this.getFallbackResponse(userMessage);
    }
  }

  private async generateStreamingResponse(
    messages: GroqChatMessage[],
    context?: GroqChatContext,
    onStream?: (chunk: string) => void
  ): Promise<AIAssistantMessage> {
    let fullResponse = '';

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages,
        model: GROQ_CONFIG.MODELS.GPT_OSS_20B,
        temperature: GROQ_CONFIG.DEFAULT_TEMPERATURE,
        max_tokens: GROQ_CONFIG.DEFAULT_MAX_COMPLETION_TOKENS,
        top_p: GROQ_CONFIG.DEFAULT_TOP_P,
        stream: true,
        stop: null
      });

      for await (const chunk of chatCompletion) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullResponse += content;
          onStream?.(content);
        }
      }

      return {
        id: `ai_stream_${Date.now()}`,
        content: fullResponse,
        timestamp: new Date(),
        type: 'text',
        context: context ? {
          patientInfo: context,
          healthStatus: 'monitoring',
          recentActivities: []
        } : undefined
      };

    } catch (error) {
      console.error('Erro no streaming da API Groq:', error);
      return this.getFallbackResponse('');
    }
  }

  private getFallbackResponse(_userMessage: string): AIAssistantMessage {
    const fallbackResponses = [
      'Olá! Como posso ajudá-lo hoje? Estou aqui para conversar e ajudar com seus cuidados de saúde.',
      'Que bom falar com você! Lembre-se de tomar seus medicamentos no horário correto.',
      'Estou aqui para acompanhar seu bem-estar. Como você está se sentindo hoje?',
      'Não esqueça de sua consulta médica agendada. Precisa de algum lembrete?',
      'Que tal uma conversa agradável? Estou sempre aqui para você.'
    ];

    const randomResponse = fallbackResponses[
      Math.floor(Math.random() * fallbackResponses.length)
    ];

    return {
      id: `fallback_${Date.now()}`,
      content: randomResponse,
      timestamp: new Date(),
      type: 'text'
    };
  }

  // Método para simular conversas com familiares
  async simulateFamilyChat(
    familyMemberName: string,
    userMessage: string,
    relationship: string = 'filho'
  ): Promise<AIAssistantMessage> {
    const familyPrompt = `
      Você está simulando uma conversa como ${familyMemberName}, ${relationship} do usuário.
      
      Características da conversa:
      - Tom carinhoso e preocupado
      - Pergunta sobre saúde e bem-estar
      - Oferece ajuda e apoio
      - Lembra de consultas e medicamentos
      - Conversa sobre família e memórias
      - Usa linguagem familiar e acolhedora
      
      Responda como ${familyMemberName} falaria com seu ${relationship === 'filho' ? 'pai/mãe' : relationship}.
    `;

    try {
      const messages: GroqChatMessage[] = [
        {
          role: 'system',
          content: familyPrompt
        },
        {
          role: 'user',
          content: userMessage
        }
      ];

      const chatCompletion = await groq.chat.completions.create({
        messages,
        model: GROQ_CONFIG.MODELS.GPT_OSS_20B,
        temperature: GROQ_CONFIG.DEFAULT_TEMPERATURE,
        max_tokens: GROQ_CONFIG.DEFAULT_MAX_COMPLETION_TOKENS,
        top_p: GROQ_CONFIG.DEFAULT_TOP_P,
        stream: false,
        stop: null
      });

      const response = chatCompletion.choices[0]?.message?.content || 
        `Oi! Como você está? Espero que esteja bem. Lembre-se de tomar seus remédios!`;

      return {
        id: `family_${Date.now()}`,
        content: response,
        timestamp: new Date(),
        type: 'text'
      };

    } catch (error) {
      console.error('Erro na simulação familiar:', error);
      
      return {
        id: `family_fallback_${Date.now()}`,
        content: `Oi! Como você está? Espero que esteja bem. Lembre-se de tomar seus remédios!`,
        timestamp: new Date(),
        type: 'text'
      };
    }
  }
}

export const groqService = new GroqService();
