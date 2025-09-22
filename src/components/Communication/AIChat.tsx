import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Mic, MicOff, Users, Bot, User, Zap, ArrowLeft } from 'lucide-react';
import { useAIChat } from '../../hooks/useAIChat';
import { GroqChatContext } from '../../services/groqService';
import { HealthReminder } from '../../types/health';
import ReminderFormModal from './ReminderFormModal';

interface AIChatProps {
  enableFamilySimulation?: boolean;
  patientContext?: GroqChatContext;
  showBackButton?: boolean;
}

export default function AIChat({ 
  enableFamilySimulation = false, 
  patientContext,
  showBackButton = false
}: AIChatProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showFamilyOptions, setShowFamilyOptions] = useState(false);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState('');
  const [selectedRelationship, setSelectedRelationship] = useState('filho');
  const [enableStreaming, setEnableStreaming] = useState(true);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderData, setReminderData] = useState<Partial<HealthReminder> | null>(null);
  const navigate = useNavigate();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    sendVoiceMessage,
    clearChat,
    startFamilySimulation
  } = useAIChat({
    enableFamilySimulation,
    familyMemberName: selectedFamilyMember,
    relationship: selectedRelationship,
    patientContext,
    onReminderIntent: (data) => {
      setReminderData(data);
      setShowReminderModal(true);
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    await sendMessage(message, enableStreaming);
    setMessage('');
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await sendVoiceMessage(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Erro ao acessar microfone:', error);
      alert('Erro ao acessar microfone. Verifique as permissões.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFamilySimulation = () => {
    if (selectedFamilyMember) {
      startFamilySimulation(selectedFamilyMember, selectedRelationship);
      setShowFamilyOptions(false);
    }
  };

  const handleReminderSave = (reminder: HealthReminder) => {
    // Adicionar mensagem de confirmação
    const confirmationMessage = {
      id: `reminder_${Date.now()}`,
      content: `✅ Lembrete criado com sucesso!\n\n"${reminder.title}"\n${reminder.description ? reminder.description + '\n' : ''}Data: ${reminder.scheduledDate.toLocaleDateString('pt-BR')}\nHorário: ${reminder.time}`,
      timestamp: new Date(),
      isFromUser: false,
      type: 'text' as const
    };
    
    setMessages(prev => [...prev, confirmationMessage]);
    setShowReminderModal(false);
    setReminderData(null);
  };

  const handleReminderCancel = () => {
    setShowReminderModal(false);
    setReminderData(null);
  };

  const familyMembers = [
    { name: 'Ana', relationship: 'filha' },
    { name: 'Carlos', relationship: 'filho' },
    { name: 'Maria', relationship: 'neto' },
    { name: 'João', relationship: 'sobrinho' }
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-2 rounded-lg transition-colors"
              title="Voltar ao início"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Assistente Virtual</h2>
            <p className="text-sm text-gray-600">
              {enableFamilySimulation ? 'Simulação Familiar' : 'Conecta60+'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEnableStreaming(!enableStreaming)}
            className={`p-2 rounded-lg transition-colors ${
              enableStreaming 
                ? 'text-blue-600 bg-blue-100 hover:bg-blue-200' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
            title={enableStreaming ? 'Desativar streaming' : 'Ativar streaming'}
          >
            <Zap className="w-5 h-5" />
          </button>
          {enableFamilySimulation && (
            <button
              onClick={() => setShowFamilyOptions(true)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
              title="Configurar simulação familiar"
            >
              <Users className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={clearChat}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
          >
            Limpar
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">Olá! Como posso ajudá-lo hoje?</p>
            <p className="text-sm">
              Posso conversar sobre sua saúde, lembrá-lo de medicamentos ou simplesmente fazer companhia.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isFromUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.isFromUser
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="flex items-start gap-2">
                {!msg.isFromUser && (
                  <Bot className="w-4 h-4 mt-1 flex-shrink-0 text-gray-500" />
                )}
                {msg.isFromUser && (
                  <User className="w-4 h-4 mt-1 flex-shrink-0 text-blue-200" />
                )}
                <div className="flex-1">
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${
                    msg.isFromUser ? 'text-blue-200' : 'text-gray-500'
                  }`}>
                    {msg.timestamp.toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-2 rounded-lg transition-colors ${
              isRecording 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
            disabled={isLoading}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Family Simulation Modal */}
      {showFamilyOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Simular Conversa Familiar
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Escolha um familiar:
                </label>
                <select
                  value={selectedFamilyMember}
                  onChange={(e) => setSelectedFamilyMember(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  {familyMembers.map((member) => (
                    <option key={member.name} value={member.name}>
                      {member.name} ({member.relationship})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relacionamento:
                </label>
                <input
                  type="text"
                  value={selectedRelationship}
                  onChange={(e) => setSelectedRelationship(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: filho, filha, neto..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowFamilyOptions(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleFamilySimulation}
                disabled={!selectedFamilyMember}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Iniciar Conversa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Lembrete */}
      <ReminderFormModal
        isOpen={showReminderModal}
        onClose={handleReminderCancel}
        onSave={handleReminderSave}
        initialData={reminderData || undefined}
      />
    </div>
  );
}
