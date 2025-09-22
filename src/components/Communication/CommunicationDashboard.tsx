import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, MessageCircle, Video, Camera, Mic, Star, Users, ArrowLeft } from 'lucide-react';
import { communicationService } from '../../services/communicationService';
import { Contact, ChatRoom, VideoCall } from '../../types/communication';
import AIChat from './AIChat';

export default function CommunicationDashboard() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [recentCalls, setRecentCalls] = useState<VideoCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'contacts' | 'chats' | 'calls' | 'ai'>('contacts');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showAIChat, setShowAIChat] = useState(false);

  useEffect(() => {
    loadCommunicationData();
  }, []);

  const loadCommunicationData = async () => {
    try {
      setLoading(true);
      const [contactsData, chatRoomsData, callsData] = await Promise.all([
        communicationService.getContacts(),
        communicationService.getChatRooms(),
        communicationService.getVideoCalls()
      ]);

      setContacts(contactsData);
      setChatRooms(chatRoomsData);
      setRecentCalls(callsData);
    } catch (error) {
      console.error('Erro ao carregar dados de comunicação:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFavoriteContacts = () => {
    return contacts.filter(contact => contact.isFavorite);
  };

  const getUnreadChats = () => {
    return chatRooms.filter(room => room.unreadCount > 0);
  };

  const handleStartCall = async (contact: Contact) => {
    try {
      const call = await communicationService.startVideoCall(contact.id);
      alert(`Iniciando chamada de vídeo com ${contact.name}...`);
    } catch (error) {
      console.error('Erro ao iniciar chamada:', error);
      alert('Erro ao iniciar chamada de vídeo');
    }
  };

  const handleSendMessage = async (contact: Contact) => {
    setSelectedContact(contact);
    setActiveTab('chats');
  };

  const handleToggleFavorite = async (contactId: string) => {
    try {
      const updatedContact = await communicationService.toggleFavorite(contactId);
      if (updatedContact) {
        setContacts(prev => 
          prev.map(contact => 
            contact.id === contactId ? updatedContact : contact
          )
        );
      }
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (showAIChat) {
    return (
      <div className="h-full">
        <div className="flex items-center gap-4 p-4 border-b border-gray-200">
          <button
            onClick={() => setShowAIChat(false)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-2 rounded-lg transition-colors"
            title="Voltar à comunicação"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          <h1 className="text-xl font-semibold">Chat com IA</h1>
        </div>
        <AIChat enableFamilySimulation={true} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-2 rounded-lg transition-colors"
            title="Voltar ao início"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Comunicação</h1>
        </div>
        <button
          onClick={() => setShowAIChat(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          Chat IA
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'contacts', label: 'Contatos', icon: Users },
          { id: 'chats', label: 'Conversas', icon: MessageCircle },
          { id: 'calls', label: 'Chamadas', icon: Phone }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            {id === 'chats' && getUnreadChats().length > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {getUnreadChats().length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'contacts' && (
          <div className="space-y-4">
            {/* Favoritos */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Favoritos
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {getFavoriteContacts().map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {contact.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{contact.name}</p>
                        <p className="text-sm text-gray-600">{contact.relationship}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStartCall(contact)}
                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg"
                        title="Chamada de vídeo"
                      >
                        <Video className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleSendMessage(contact)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                        title="Enviar mensagem"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Todos os Contatos */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Todos os Contatos</h2>
              <div className="space-y-2">
                {contacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-semibold">
                          {contact.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{contact.name}</p>
                        <p className="text-sm text-gray-600">{contact.relationship}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleFavorite(contact.id)}
                        className="p-2 text-gray-400 hover:text-yellow-500 rounded-lg"
                        title={contact.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                      >
                        <Star className={`w-5 h-5 ${contact.isFavorite ? 'fill-current text-yellow-500' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleStartCall(contact)}
                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg"
                        title="Chamada de vídeo"
                      >
                        <Video className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleSendMessage(contact)}
                        className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                        title="Enviar mensagem"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chats' && (
          <div className="space-y-3">
            {chatRooms.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nenhuma conversa iniciada</p>
            ) : (
              chatRooms.map((room) => {
                const contact = contacts.find(c => c.id === room.contactId);
                if (!contact) return null;

                return (
                  <div key={room.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {contact.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-800">{contact.name}</p>
                          {room.unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                              {room.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate max-w-xs">
                          {room.lastMessage?.content || 'Nenhuma mensagem'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {room.lastMessage?.timestamp.toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        }) || ''}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'calls' && (
          <div className="space-y-3">
            {recentCalls.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nenhuma chamada recente</p>
            ) : (
              recentCalls.map((call) => {
                const contact = contacts.find(c => c.id === call.contactId);
                if (!contact) return null;

                return (
                  <div key={call.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Phone className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{contact.name}</p>
                        <p className="text-sm text-gray-600">
                          {call.startTime.toLocaleDateString('pt-BR')} às {call.startTime.toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-800">
                        {call.duration ? `${call.duration}min` : '-'}
                      </p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        call.status === 'ended' ? 'bg-green-100 text-green-800' :
                        call.status === 'missed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {call.status === 'ended' ? 'Finalizada' :
                         call.status === 'missed' ? 'Perdida' :
                         call.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
