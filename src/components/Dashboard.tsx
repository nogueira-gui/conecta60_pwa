import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  MessageCircle, 
  Phone, 
  Shield, 
  HelpCircle,
  Settings,
  Users,
  Bot
} from 'lucide-react';

interface DashboardProps {
  user: {
    name: string;
  };
  onOpenSupport?: () => void;
}

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  color: string;
}

function MenuItem({ icon, title, description, onClick, color }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`${color} hover:scale-105 transform transition-all duration-200 rounded-2xl p-8 shadow-lg hover:shadow-xl text-left w-full group`}
    >
      <div className="flex items-center gap-6">
        <div className="bg-white bg-opacity-20 p-4 rounded-xl group-hover:bg-opacity-30 transition-all duration-200">
          {icon}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
          <p className="text-xl text-white opacity-90">{description}</p>
        </div>
      </div>
    </button>
  );
}

export function Dashboard({ user, onOpenSupport }: DashboardProps) {
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: <Heart className="h-12 w-12 text-white" />,
      title: 'Saúde',
      description: 'Consultas e medicamentos',
      onClick: () => navigate('/saude'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      icon: <MessageCircle className="h-12 w-12 text-white" />,
      title: 'Conversar',
      description: 'Família e amigos',
      onClick: () => navigate('/comunicacao'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: <Bot className="h-12 w-12 text-white" />,
      title: 'Chat IA',
      description: 'Assistente virtual',
      onClick: () => navigate('/chat-ia'),
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      icon: <Phone className="h-12 w-12 text-white" />,
      title: 'Ligar',
      description: 'Contatos importantes',
      onClick: () => alert('Funcionalidade em desenvolvimento'),
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  const supportItems = [
    {
      icon: <Shield className="h-10 w-10 text-white" />,
      title: 'Segurança',
      description: 'Proteção contra golpes',
      onClick: () => alert('Centro de Segurança'),
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      icon: <HelpCircle className="h-10 w-10 text-white" />,
      title: 'Ajuda',
      description: 'Suporte 24 horas',
      onClick: () => onOpenSupport?.(),
      color: 'bg-teal-500 hover:bg-teal-600'
    },
    {
      icon: <Settings className="h-10 w-10 text-white" />,
      title: 'Configurações',
      description: 'Ajustar o aplicativo',
      onClick: () => alert('Configurações'),
      color: 'bg-gray-500 hover:bg-gray-600'
    },
    {
      icon: <Users className="h-10 w-10 text-white" />,
      title: 'Família',
      description: 'Contatos de confiança',
      onClick: () => alert('Rede Familiar'),
      color: 'bg-pink-500 hover:bg-pink-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Saudação */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            Olá, {user.name.split(' ')[0]}! 👋
          </h2>
          <p className="text-2xl text-gray-600">
            O que você gostaria de fazer hoje?
          </p>
        </div>

        {/* Menu Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {menuItems.map((item, index) => (
            <MenuItem key={index} {...item} />
          ))}
        </div>

        {/* Menu de Suporte */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Suporte e Ajuda</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {supportItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className={`${item.color} hover:scale-105 transform transition-all duration-200 rounded-xl p-6 shadow-md hover:shadow-lg text-left w-full group`}
              >
                <div className="text-center">
                  <div className="bg-white bg-opacity-20 p-3 rounded-lg inline-flex group-hover:bg-opacity-30 transition-all duration-200 mb-3">
                    {item.icon}
                  </div>
                  <h4 className="text-lg font-bold text-white mb-1">{item.title}</h4>
                  <p className="text-sm text-white opacity-90">{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mensagem de Status da Sprint */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl shadow-lg p-8 mt-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Sprint 3 - Funcionalidades Core</h3>
          <p className="text-xl text-blue-100 mb-4">
            Suporte 24 horas e Tutoriais!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="bg-green-500 text-white px-4 py-2 rounded-full text-lg font-medium">
              ✅ Suporte 24 horas por IA
            </span>
            <span className="bg-green-500 text-white px-4 py-2 rounded-full text-lg font-medium">
              ✅ Suporte Humano
            </span>
            <span className="bg-green-500 text-white px-4 py-2 rounded-full text-lg font-medium">
              ✅ Tutoriais
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}