import { useState, useCallback } from 'react';
import { groqService, GroqChatContext } from '../services/groqService';
import { intentService, IntentAnalysis } from '../services/intentService';
import { AIAssistantMessage } from '../types/communication';
import { HealthReminder } from '../types/health';

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  isFromUser: boolean;
  type: 'text' | 'voice';
  isLoading?: boolean;
}

export interface UseAIChatOptions {
  enableFamilySimulation?: boolean;
  familyMemberName?: string;
  relationship?: string;
  patientContext?: GroqChatContext;
  onReminderIntent?: (reminderData: Partial<HealthReminder>) => void;
}

export function useAIChat(options: UseAIChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `chat_${Date.now()}_${Math.random()}`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const sendMessage = useCallback(async (content: string, enableStreaming: boolean = false) => {
    if (!content.trim()) return;

    // Adicionar mensagem do usuário
    const userMessage = addMessage({
      content: content.trim(),
      isFromUser: true,
      type: 'text'
    });

    setIsLoading(true);
    setError(null);

    try {
      // Analisar intenção do usuário
      const intentAnalysis: IntentAnalysis = intentService.analyzeIntent(content);
      
      // Se a intenção é criar lembrete e temos callback
      if (intentAnalysis.intent === 'create_reminder' && options.onReminderIntent) {
        const confirmation = intentService.generateReminderConfirmation(intentAnalysis.reminderData!);
        
        // Adicionar confirmação da IA
        addMessage({
          content: confirmation,
          isFromUser: false,
          type: 'text',
          isLoading: false
        });

        // Mostrar modal de lembrete após um breve delay
        setTimeout(() => {
          options.onReminderIntent!(intentAnalysis.reminderData!);
        }, 1000);

        setIsLoading(false);
        return;
      }

      let aiResponse: AIAssistantMessage;

      // Verificar se deve simular conversa familiar
      if (options.enableFamilySimulation && options.familyMemberName) {
        aiResponse = await groqService.simulateFamilyChat(
          options.familyMemberName,
          content,
          options.relationship || 'filho'
        );
      } else {
        if (enableStreaming) {
          // Criar mensagem temporária para streaming
          const streamingMessage = addMessage({
            content: '',
            isFromUser: false,
            type: 'text',
            isLoading: true
          });

          // Atualizar mensagem com streaming
          const updateStreamingMessage = (chunk: string) => {
            setMessages(prev => prev.map(msg => 
              msg.id === streamingMessage.id 
                ? { ...msg, content: msg.content + chunk }
                : msg
            ));
          };

          aiResponse = await groqService.generateResponse(
            content, 
            options.patientContext, 
            updateStreamingMessage
          );

          // Finalizar mensagem de streaming
          setMessages(prev => prev.map(msg => 
            msg.id === streamingMessage.id 
              ? { ...msg, content: aiResponse.content, isLoading: false }
              : msg
          ));

          return; // Não adicionar nova mensagem, já foi atualizada
        } else {
          aiResponse = await groqService.generateResponse(content, options.patientContext);
        }
      }

      // Adicionar resposta da IA (apenas para não-streaming)
      if (!enableStreaming) {
        addMessage({
          content: aiResponse.content,
          isFromUser: false,
          type: aiResponse.type,
          isLoading: false
        });
      }

    } catch (err) {
      console.error('Erro no chat com IA:', err);
      setError('Erro ao enviar mensagem. Tente novamente.');
      
      // Adicionar mensagem de erro
      addMessage({
        content: 'Desculpe, ocorreu um erro. Tente novamente em alguns instantes.',
        isFromUser: false,
        type: 'text'
      });
    } finally {
      setIsLoading(false);
    }
  }, [addMessage, options]);

  const sendVoiceMessage = useCallback(async (audioBlob: Blob) => {
    // Simular processamento de áudio
    setIsLoading(true);
    setError(null);

    try {
      // Aqui você implementaria o processamento de áudio real
      // Por enquanto, vamos simular uma transcrição
      const simulatedTranscription = "Esta é uma mensagem de voz simulada";
      
      await sendMessage(simulatedTranscription);
    } catch (err) {
      console.error('Erro ao processar áudio:', err);
      setError('Erro ao processar mensagem de voz.');
    } finally {
      setIsLoading(false);
    }
  }, [sendMessage]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const startFamilySimulation = useCallback((familyMemberName: string, relationship: string = 'filho') => {
    // Adicionar mensagem de boas-vindas
    addMessage({
      content: `Olá! Sou o ${familyMemberName}, seu ${relationship}. Como você está se sentindo hoje?`,
      isFromUser: false,
      type: 'text'
    });
  }, [addMessage]);

  const getChatSummary = useCallback(() => {
    const userMessages = messages.filter(m => m.isFromUser);
    const aiMessages = messages.filter(m => !m.isFromUser);
    
    return {
      totalMessages: messages.length,
      userMessages: userMessages.length,
      aiMessages: aiMessages.length,
      lastActivity: messages.length > 0 ? messages[messages.length - 1].timestamp : null,
      conversationDuration: messages.length > 0 
        ? messages[messages.length - 1].timestamp.getTime() - messages[0].timestamp.getTime()
        : 0
    };
  }, [messages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    sendVoiceMessage,
    clearChat,
    startFamilySimulation,
    getChatSummary,
    addMessage
  };
}
