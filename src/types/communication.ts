// Tipos para o módulo de comunicação
export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relationship: string;
  isFavorite: boolean;
  avatar?: string;
  lastContact?: Date;
}

export interface Message {
  id: string;
  contactId: string;
  content: string;
  type: 'text' | 'voice' | 'photo' | 'video';
  timestamp: Date;
  isRead: boolean;
  isFromUser: boolean;
  attachments?: string[];
}

export interface VoiceMessage {
  id: string;
  contactId: string;
  audioUrl: string;
  duration: number;
  timestamp: Date;
  isFromUser: boolean;
}

export interface PhotoMessage {
  id: string;
  contactId: string;
  imageUrl: string;
  caption?: string;
  timestamp: Date;
  isFromUser: boolean;
}

export interface VideoCall {
  id: string;
  contactId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  status: 'incoming' | 'outgoing' | 'ongoing' | 'ended' | 'missed';
  quality: 'good' | 'fair' | 'poor';
}

export interface ChatRoom {
  id: string;
  contactId: string;
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
  isActive: boolean;
}

export interface AIAssistantMessage {
  id: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'voice';
  context?: {
    patientInfo?: any;
    healthStatus?: string;
    recentActivities?: string[];
  };
}
