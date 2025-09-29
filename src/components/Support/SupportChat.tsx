import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Phone, User, Bot, Clock, CheckCircle } from 'lucide-react';
import { SupportService } from '../../services/supportService';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

interface SupportChatProps {
  onClose: () => void;
}

const SupportChat: React.FC<SupportChatProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Sou o assistente virtual do Conecta60+. Como posso ajudá-lo hoje?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Buscar resposta nos documentos do projeto
      const response = await SupportService.searchInProjectDocs(inputText);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };

      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Desculpe, ocorreu um erro. Tente novamente ou entre em contato com nosso suporte humano.',
        isUser: false,
        timestamp: new Date()
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    'Como fazer login?',
    'Esqueci minha senha',
    'Como agendar consulta médica?',
    'Como adicionar contato de emergência?',
    'Como fazer uma chamada de vídeo?',
    'Como configurar lembretes de medicamento?'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Suporte 24/7</h2>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span>{isConnected ? 'Online' : 'Offline'}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {!message.isUser && (
                    <Bot className="w-5 h-5 mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm">{message.text}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs opacity-75">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      {message.isUser && (
                        <CheckCircle className="w-3 h-3 text-green-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t bg-gray-50">
          <p className="text-sm text-gray-600 mb-2">Perguntas frequentes:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => setInputText(action)}
                className="bg-white border border-gray-300 rounded-full px-3 py-1 text-sm hover:bg-gray-50 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua pergunta..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 p-3 rounded-b-lg">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                <Phone className="w-4 h-4" />
                <span>Suporte Humano</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
                <User className="w-4 h-4" />
                <span>Falar com Especialista</span>
              </button>
            </div>
            <span>Assistente Virtual Conecta60+</span>
          </div>
        </div>
      </div>
    </div>
  );
};


export default SupportChat;
