import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ArrowRight, Heart, MessageCircle, Bot } from 'lucide-react';

interface BreadcrumbItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const breadcrumbMap: Record<string, BreadcrumbItem> = {
  '/': {
    path: '/',
    label: 'Início',
    icon: <Home className="w-4 h-4" />
  },
  '/saude': {
    path: '/saude',
    label: 'Saúde',
    icon: <Heart className="w-4 h-4" />
  },
  '/saude/lembrete': {
    path: '/saude/lembrete',
    label: 'Criar Lembrete',
    icon: <Heart className="w-4 h-4" />
  },
  '/comunicacao': {
    path: '/comunicacao',
    label: 'Comunicação',
    icon: <MessageCircle className="w-4 h-4" />
  },
  '/chat-ia': {
    path: '/chat-ia',
    label: 'Chat IA',
    icon: <Bot className="w-4 h-4" />
  }
};

export default function NavigationBreadcrumb() {
  const navigate = useNavigate();
  const location = useLocation();

  // Não mostrar breadcrumb na página inicial
  if (location.pathname === '/') {
    return null;
  }

  const currentPage = breadcrumbMap[location.pathname];
  if (!currentPage) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200 text-sm">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
        title="Voltar ao início"
      >
        <Home className="w-4 h-4" />
        <span>Início</span>
      </button>
      
      <ArrowRight className="w-4 h-4 text-gray-400" />
      
      <div className="flex items-center gap-1 text-gray-800 font-medium">
        {currentPage.icon}
        <span>{currentPage.label}</span>
      </div>
    </div>
  );
}
