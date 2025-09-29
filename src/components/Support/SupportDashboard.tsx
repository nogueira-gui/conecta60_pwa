import React, { useState } from 'react';
import { MessageCircle, BookOpen, Video, Phone, HelpCircle, Search, ArrowLeft } from 'lucide-react';
import SupportChat from './SupportChat';
import FAQSection from './FAQSection';
import TutorialSection from './TutorialSection';
import HumanSupport from './HumanSupport';

type SupportView = 'main' | 'chat' | 'faq' | 'tutorials' | 'human';

const SupportDashboard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentView, setCurrentView] = useState<SupportView>('main');

  const supportOptions = [
    {
      id: 'chat' as const,
      title: 'Chat com Assistente Virtual',
      description: 'Fale com nosso assistente inteligente 24/7',
      icon: MessageCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      available: true
    },
    {
      id: 'faq' as const,
      title: 'Perguntas Frequentes',
      description: 'Encontre respostas rápidas para dúvidas comuns',
      icon: HelpCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      available: true
    },
    {
      id: 'tutorials' as const,
      title: 'Tutoriais Interativos',
      description: 'Aprenda a usar o app passo a passo',
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      available: true
    },
    {
      id: 'human' as const,
      title: 'Suporte Humano',
      description: 'Fale com nossos especialistas',
      icon: Phone,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      available: true
    }
  ];

  const quickActions = [
    'Como fazer login?',
    'Esqueci minha senha',
    'Como agendar consulta médica?',
    'Como fazer chamada de vídeo?',
    'Como configurar lembretes?',
    'Problema técnico'
  ];

  const renderCurrentView = () => {
    switch (currentView) {
      case 'chat':
        return <SupportChat onClose={() => setCurrentView('main')} />;
      case 'faq':
        return <FAQSection onOpenChat={() => setCurrentView('chat')} />;
      case 'tutorials':
        return <TutorialSection onBack={() => setCurrentView('main')} />;
      case 'human':
        return <HumanSupport onClose={() => setCurrentView('main')} />;
      default:
        return null;
    }
  };

  if (currentView !== 'main') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="w-full h-full max-w-7xl max-h-[95vh] bg-white rounded-lg shadow-xl overflow-hidden">
          {renderCurrentView()}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Central de Suporte Conecta60+
              </h1>
              <p className="text-lg text-gray-600">
                Estamos aqui para ajudá-lo 24 horas por dia, 7 dias por semana
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Ações Rápidas
            </h3>
            <div className="flex flex-wrap gap-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentView('chat')}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          {/* Support Options */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {supportOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setCurrentView(option.id)}
                disabled={!option.available}
                className={`p-6 rounded-lg border-2 transition-all text-left ${
                  option.available
                    ? `${option.borderColor} ${option.bgColor} hover:shadow-lg`
                    : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${option.bgColor}`}>
                    <option.icon className={`w-6 h-6 ${option.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {option.title}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {option.description}
                    </p>
                    {option.available ? (
                      <span className="inline-flex items-center text-sm text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Disponível
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-sm text-gray-500">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                        Indisponível
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Outras formas de contato
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <Phone className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-800">Telefone</h4>
                <p className="text-sm text-gray-600">0800 123 4567</p>
                <p className="text-xs text-gray-500">Seg-Sex: 8h-18h</p>
              </div>
              <div className="text-center">
                <MessageCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-800">WhatsApp</h4>
                <p className="text-sm text-gray-600">(11) 99999-9999</p>
                <p className="text-xs text-gray-500">24h por dia</p>
              </div>
              <div className="text-center">
                <Video className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-800">Vídeo Chamada</h4>
                <p className="text-sm text-gray-600">Agendamento</p>
                <p className="text-xs text-gray-500">Seg-Sex: 9h-17h</p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="font-medium text-red-800">Emergência</span>
            </div>
            <p className="text-sm text-red-700 mt-1">
              Para situações de emergência médica, ligue para 192 (SAMU) ou 193 (Bombeiros)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportDashboard;
