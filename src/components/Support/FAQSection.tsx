import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Search, BookOpen, HelpCircle, Video, Phone } from 'lucide-react';
import { SupportService } from '../../services/supportService';

interface FAQSectionProps {
  onOpenChat: () => void;
}

const FAQSection: React.FC<FAQSectionProps> = ({ onOpenChat }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const categories = SupportService.getCategories();
  const allFAQ = SupportService.getAllFAQ();
  
  // Filtrar FAQ baseado na busca e categoria
  const filteredFAQ = allFAQ.filter(faq => {
    const matchesSearch = searchTerm === '' || 
      faq.pergunta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.resposta.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === null || faq.categoria === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'saude': return '🏥';
      case 'comunicacao': return '💬';
      case 'financas': return '💰';
      case 'autenticacao': return '🔐';
      case 'configuracao': return '⚙️';
      default: return '❓';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'saude': return 'Saúde';
      case 'comunicacao': return 'Comunicação';
      case 'financas': return 'Finanças';
      case 'autenticacao': return 'Login e Segurança';
      case 'configuracao': return 'Configurações';
      default: return category;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Central de Ajuda - Conecta60+
        </h1>
        <p className="text-lg text-gray-600">
          Encontre respostas rápidas para suas dúvidas ou fale com nosso suporte
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar ajuda..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Categorias</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Todas
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {getCategoryIcon(category)} {getCategoryName(category)}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {filteredFAQ.length === 0 ? (
          <div className="text-center py-8">
            <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Nenhuma pergunta encontrada
            </h3>
            <p className="text-gray-500 mb-4">
              Tente uma busca diferente ou entre em contato conosco
            </p>
            <button
              onClick={onOpenChat}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Falar com Suporte
            </button>
          </div>
        ) : (
          filteredFAQ.map((faq, index) => {
            const isExpanded = expandedItems.has(faq.pergunta);
            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleExpanded(faq.pergunta)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getCategoryIcon(faq.categoria)}</span>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">
                        {faq.pergunta}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {getCategoryName(faq.categoria)}
                      </p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="px-6 pb-4 border-t border-gray-100">
                    <div className="pt-4">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.resposta}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Support Options */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Ainda precisa de ajuda?
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={onOpenChat}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-center"
          >
            <MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-800">Chat Online</h4>
            <p className="text-sm text-gray-600">Fale com nosso assistente virtual</p>
          </button>
          
          <button className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-center">
            <Video className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-800">Vídeo Tutorial</h4>
            <p className="text-sm text-gray-600">Aprenda passo a passo</p>
          </button>
          
          <button className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-center">
            <Phone className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-800">Suporte Humano</h4>
            <p className="text-sm text-gray-600">0800 123 4567</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
