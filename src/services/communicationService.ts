import { 
  Contact, 
  Message, 
  VoiceMessage, 
  PhotoMessage, 
  VideoCall, 
  ChatRoom 
} from '../types/communication';

// Dados mockados para demonstração
const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Ana Silva',
    phone: '(11) 99999-9999',
    email: 'ana.silva@email.com',
    relationship: 'Filha',
    isFavorite: true,
    avatar: '/avatars/ana.jpg',
    lastContact: new Date('2024-01-10')
  },
  {
    id: '2',
    name: 'Carlos Silva',
    phone: '(11) 88888-8888',
    email: 'carlos.silva@email.com',
    relationship: 'Filho',
    isFavorite: true,
    avatar: '/avatars/carlos.jpg',
    lastContact: new Date('2024-01-09')
  },
  {
    id: '3',
    name: 'Dr. João Silva',
    phone: '(11) 77777-7777',
    email: 'dr.joao@hospital.com',
    relationship: 'Médico',
    isFavorite: false,
    avatar: '/avatars/dr-joao.jpg',
    lastContact: new Date('2024-01-05')
  },
  {
    id: '4',
    name: 'Maria Santos',
    phone: '(11) 66666-6666',
    relationship: 'Amiga',
    isFavorite: false,
    avatar: '/avatars/maria.jpg',
    lastContact: new Date('2024-01-08')
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    contactId: '1',
    content: 'Oi pai! Como você está se sentindo hoje?',
    type: 'text',
    timestamp: new Date('2024-01-10 10:30'),
    isRead: true,
    isFromUser: false
  },
  {
    id: '2',
    contactId: '1',
    content: 'Estou bem, filha. Lembrei de tomar o remédio da pressão.',
    type: 'text',
    timestamp: new Date('2024-01-10 10:32'),
    isRead: true,
    isFromUser: true
  },
  {
    id: '3',
    contactId: '1',
    content: 'Que bom! Não esqueça da consulta de amanhã às 14h.',
    type: 'text',
    timestamp: new Date('2024-01-10 10:35'),
    isRead: true,
    isFromUser: false
  },
  {
    id: '4',
    contactId: '2',
    content: 'Pai, mandei algumas fotos do neto para você ver!',
    type: 'text',
    timestamp: new Date('2024-01-09 15:20'),
    isRead: true,
    isFromUser: false,
    attachments: ['/photos/neto1.jpg', '/photos/neto2.jpg']
  },
  {
    id: '5',
    contactId: '3',
    content: 'Sua consulta de amanhã está confirmada. Lembre-se de trazer os exames.',
    type: 'text',
    timestamp: new Date('2024-01-05 16:45'),
    isRead: true,
    isFromUser: false
  }
];

const mockChatRooms: ChatRoom[] = [
  {
    id: '1',
    contactId: '1',
    messages: mockMessages.filter(m => m.contactId === '1'),
    lastMessage: mockMessages.find(m => m.contactId === '1'),
    unreadCount: 0,
    isActive: true
  },
  {
    id: '2',
    contactId: '2',
    messages: mockMessages.filter(m => m.contactId === '2'),
    lastMessage: mockMessages.find(m => m.contactId === '2'),
    unreadCount: 0,
    isActive: true
  },
  {
    id: '3',
    contactId: '3',
    messages: mockMessages.filter(m => m.contactId === '3'),
    lastMessage: mockMessages.find(m => m.contactId === '3'),
    unreadCount: 1,
    isActive: false
  }
];

const mockVideoCalls: VideoCall[] = [
  {
    id: '1',
    contactId: '1',
    startTime: new Date('2024-01-08 19:00'),
    endTime: new Date('2024-01-08 19:25'),
    duration: 25,
    status: 'ended',
    quality: 'good'
  },
  {
    id: '2',
    contactId: '2',
    startTime: new Date('2024-01-07 14:30'),
    endTime: new Date('2024-01-07 14:45'),
    duration: 15,
    status: 'ended',
    quality: 'fair'
  }
];

class CommunicationService {
  // Gerenciamento de Contatos
  async getContacts(): Promise<Contact[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockContacts;
  }

  async getFavoriteContacts(): Promise<Contact[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockContacts.filter(contact => contact.isFavorite);
  }

  async addContact(contact: Omit<Contact, 'id'>): Promise<Contact> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const newContact: Contact = {
      ...contact,
      id: `contact_${Date.now()}`
    };
    
    mockContacts.push(newContact);
    return newContact;
  }

  async updateContact(contactId: string, updates: Partial<Contact>): Promise<Contact | null> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = mockContacts.findIndex(contact => contact.id === contactId);
    if (index !== -1) {
      mockContacts[index] = { ...mockContacts[index], ...updates };
      return mockContacts[index];
    }
    return null;
  }

  async toggleFavorite(contactId: string): Promise<Contact | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockContacts.findIndex(contact => contact.id === contactId);
    if (index !== -1) {
      mockContacts[index].isFavorite = !mockContacts[index].isFavorite;
      return mockContacts[index];
    }
    return null;
  }

  // Gerenciamento de Mensagens
  async getChatRooms(): Promise<ChatRoom[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockChatRooms;
  }

  async getMessages(contactId: string): Promise<Message[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockMessages.filter(message => message.contactId === contactId);
  }

  async sendMessage(message: Omit<Message, 'id' | 'timestamp' | 'isRead'>): Promise<Message> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newMessage: Message = {
      ...message,
      id: `msg_${Date.now()}`,
      timestamp: new Date(),
      isRead: false
    };
    
    mockMessages.push(newMessage);
    
    // Atualizar chat room
    const chatRoom = mockChatRooms.find(room => room.contactId === message.contactId);
    if (chatRoom) {
      chatRoom.messages.push(newMessage);
      chatRoom.lastMessage = newMessage;
      if (!message.isFromUser) {
        chatRoom.unreadCount++;
      }
    }
    
    return newMessage;
  }

  async markMessagesAsRead(contactId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const chatRoom = mockChatRooms.find(room => room.contactId === contactId);
    if (chatRoom) {
      chatRoom.unreadCount = 0;
      // Marcar mensagens como lidas
      mockMessages.forEach(message => {
        if (message.contactId === contactId && !message.isFromUser) {
          message.isRead = true;
        }
      });
      return true;
    }
    return false;
  }

  // Mensagens de Voz
  async sendVoiceMessage(voiceMessage: Omit<VoiceMessage, 'id' | 'timestamp'>): Promise<VoiceMessage> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newVoiceMessage: VoiceMessage = {
      ...voiceMessage,
      id: `voice_${Date.now()}`,
      timestamp: new Date()
    };
    
    // Converter para Message e adicionar à lista
    const message: Message = {
      id: newVoiceMessage.id,
      contactId: newVoiceMessage.contactId,
      content: `Mensagem de voz (${newVoiceMessage.duration}s)`,
      type: 'voice',
      timestamp: newVoiceMessage.timestamp,
      isRead: false,
      isFromUser: newVoiceMessage.isFromUser,
      attachments: [newVoiceMessage.audioUrl]
    };
    
    mockMessages.push(message);
    
    // Atualizar chat room
    const chatRoom = mockChatRooms.find(room => room.contactId === voiceMessage.contactId);
    if (chatRoom) {
      chatRoom.messages.push(message);
      chatRoom.lastMessage = message;
    }
    
    return newVoiceMessage;
  }

  // Fotos
  async sendPhoto(photoMessage: Omit<PhotoMessage, 'id' | 'timestamp'>): Promise<PhotoMessage> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const newPhotoMessage: PhotoMessage = {
      ...photoMessage,
      id: `photo_${Date.now()}`,
      timestamp: new Date()
    };
    
    // Converter para Message e adicionar à lista
    const message: Message = {
      id: newPhotoMessage.id,
      contactId: newPhotoMessage.contactId,
      content: newPhotoMessage.caption || 'Foto enviada',
      type: 'photo',
      timestamp: newPhotoMessage.timestamp,
      isRead: false,
      isFromUser: newPhotoMessage.isFromUser,
      attachments: [newPhotoMessage.imageUrl]
    };
    
    mockMessages.push(message);
    
    // Atualizar chat room
    const chatRoom = mockChatRooms.find(room => room.contactId === photoMessage.contactId);
    if (chatRoom) {
      chatRoom.messages.push(message);
      chatRoom.lastMessage = message;
    }
    
    return newPhotoMessage;
  }

  // Video Chamadas
  async getVideoCalls(contactId?: string): Promise<VideoCall[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    if (contactId) {
      return mockVideoCalls.filter(call => call.contactId === contactId);
    }
    return mockVideoCalls;
  }

  async startVideoCall(contactId: string): Promise<VideoCall> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newCall: VideoCall = {
      id: `call_${Date.now()}`,
      contactId,
      startTime: new Date(),
      status: 'outgoing',
      quality: 'good'
    };
    
    mockVideoCalls.push(newCall);
    return newCall;
  }

  async endVideoCall(callId: string): Promise<VideoCall | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const call = mockVideoCalls.find(c => c.id === callId);
    if (call) {
      call.endTime = new Date();
      call.duration = Math.floor((call.endTime.getTime() - call.startTime.getTime()) / 1000);
      call.status = 'ended';
      return call;
    }
    return null;
  }

  async answerVideoCall(callId: string): Promise<VideoCall | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const call = mockVideoCalls.find(c => c.id === callId);
    if (call) {
      call.status = 'ongoing';
      return call;
    }
    return null;
  }

  // Métodos auxiliares para simulação
  async simulateIncomingMessage(contactId: string, content: string): Promise<Message> {
    const contact = mockContacts.find(c => c.id === contactId);
    if (!contact) throw new Error('Contact not found');

    const message = await this.sendMessage({
      contactId,
      content,
      type: 'text',
      isFromUser: false
    });

    // Atualizar último contato
    contact.lastContact = new Date();

    return message;
  }

  async simulateIncomingCall(contactId: string): Promise<VideoCall> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newCall: VideoCall = {
      id: `incoming_call_${Date.now()}`,
      contactId,
      startTime: new Date(),
      status: 'incoming',
      quality: 'good'
    };
    
    mockVideoCalls.push(newCall);
    return newCall;
  }
}

export const communicationService = new CommunicationService();
