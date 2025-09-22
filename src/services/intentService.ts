import { HealthReminder } from '../types/health';

export interface IntentAnalysis {
  intent: 'create_reminder' | 'general_chat' | 'health_question' | 'emergency';
  confidence: number;
  reminderData?: Partial<HealthReminder>;
  extractedInfo?: {
    medication?: string;
    appointment?: string;
    exam?: string;
    time?: string;
    date?: string;
    frequency?: string;
  };
}

class IntentService {
  private reminderKeywords = {
    medication: [
      'medicamento', 'remédio', 'comprimido', 'pílula', 'tomar', 'medicação',
      'losartana', 'pressão', 'diabetes', 'colesterol', 'dor', 'anti-inflamatório'
    ],
    appointment: [
      'consulta', 'médico', 'doutor', 'agendar', 'marcar', 'cardiológico',
      'clínico', 'especialista', 'retorno', 'revisão'
    ],
    exam: [
      'exame', 'laboratório', 'sangue', 'urina', 'raio-x', 'ultrassom',
      'mamografia', 'colesterol', 'glicemia', 'hemograma'
    ],
    time: [
      'manhã', 'tarde', 'noite', 'madrugada', '8h', '9h', '10h', '14h', '15h',
      '16h', '18h', '19h', '20h', '21h', '22h', 'hora', 'horário'
    ],
    frequency: [
      'diário', 'diariamente', 'todo dia', 'semanal', 'semanalmente',
      'mensal', 'mensalmente', 'duas vezes', 'três vezes'
    ]
  };

  private emergencyKeywords = [
    'emergência', 'urgente', 'ambulância', 'hospital', 'socorro',
    'dor no peito', 'falta de ar', 'desmaio', 'sangramento'
  ];

  analyzeIntent(userMessage: string): IntentAnalysis {
    const message = userMessage.toLowerCase();
    
    // Verificar se é emergência primeiro
    if (this.isEmergency(message)) {
      return {
        intent: 'emergency',
        confidence: 0.9
      };
    }

    // Verificar se é solicitação de lembrete
    const reminderIntent = this.analyzeReminderIntent(message);
    if (reminderIntent.confidence > 0.6) {
      return reminderIntent;
    }

    // Verificar se é pergunta sobre saúde
    if (this.isHealthQuestion(message)) {
      return {
        intent: 'health_question',
        confidence: 0.7
      };
    }

    // Chat geral
    return {
      intent: 'general_chat',
      confidence: 0.8
    };
  }

  private isEmergency(message: string): boolean {
    return this.emergencyKeywords.some(keyword => message.includes(keyword));
  }

  private isHealthQuestion(message: string): boolean {
    const healthQuestionWords = [
      'como', 'o que', 'por que', 'quando', 'onde', 'qual',
      'sintoma', 'dor', 'mal estar', 'problema', 'causa',
      'tratamento', 'cura', 'prevenção'
    ];
    
    return healthQuestionWords.some(word => message.includes(word));
  }

  private analyzeReminderIntent(message: string): IntentAnalysis {
    const reminderTriggers = [
      'lembrar', 'lembrete', 'criar', 'adicionar', 'configurar',
      'marcar', 'agendar', 'programar', 'notificar'
    ];

    const hasReminderTrigger = reminderTriggers.some(trigger => 
      message.includes(trigger)
    );

    if (!hasReminderTrigger) {
      return {
        intent: 'general_chat',
        confidence: 0.3
      };
    }

    const extractedInfo = this.extractReminderInfo(message);
    const reminderData = this.buildReminderData(extractedInfo);

    let confidence = 0.5;
    
    // Aumentar confiança baseado nas informações extraídas
    if (extractedInfo.medication) confidence += 0.2;
    if (extractedInfo.appointment) confidence += 0.2;
    if (extractedInfo.exam) confidence += 0.2;
    if (extractedInfo.time) confidence += 0.1;
    if (extractedInfo.date) confidence += 0.1;

    return {
      intent: 'create_reminder',
      confidence: Math.min(confidence, 0.95),
      reminderData,
      extractedInfo
    };
  }

  private extractReminderInfo(message: string) {
    const info: IntentAnalysis['extractedInfo'] = {};

    // Extrair tipo de lembrete
    if (this.reminderKeywords.medication.some(keyword => message.includes(keyword))) {
      info.medication = this.extractMedicationName(message);
    }
    
    if (this.reminderKeywords.appointment.some(keyword => message.includes(keyword))) {
      info.appointment = this.extractAppointmentInfo(message);
    }
    
    if (this.reminderKeywords.exam.some(keyword => message.includes(keyword))) {
      info.exam = this.extractExamInfo(message);
    }

    // Extrair horário
    info.time = this.extractTime(message);

    // Extrair data
    info.date = this.extractDate(message);

    // Extrair frequência
    info.frequency = this.extractFrequency(message);

    return info;
  }

  private extractMedicationName(message: string): string {
    const medicationPatterns = [
      /(?:tomar|medicamento|remédio)\s+([a-záêôçã\s]+?)(?:\s+às|\s+no|\s+de|$)/i,
      /([a-záêôçã\s]+?)\s+(?:mg|ml|comprimido|pílula)/i
    ];

    for (const pattern of medicationPatterns) {
      const match = message.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }

    return 'Medicamento';
  }

  private extractAppointmentInfo(message: string): string {
    const appointmentPatterns = [
      /(?:consulta|médico|doutor)\s+([a-záêôçã\s]+?)(?:\s+no|\s+de|$)/i,
      /(?:agendar|marcar)\s+([a-záêôçã\s]+?)(?:\s+para|\s+no|$)/i
    ];

    for (const pattern of appointmentPatterns) {
      const match = message.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }

    return 'Consulta médica';
  }

  private extractExamInfo(message: string): string {
    const examPatterns = [
      /(?:exame|laboratório)\s+([a-záêôçã\s]+?)(?:\s+no|\s+de|$)/i,
      /([a-záêôçã\s]+?)\s+(?:exame|laboratório)/i
    ];

    for (const pattern of examPatterns) {
      const match = message.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }

    return 'Exame médico';
  }

  private extractTime(message: string): string {
    // Horários específicos
    const timePatterns = [
      /(\d{1,2})[h:](\d{0,2})/g,
      /(\d{1,2})\s*horas?/g,
      /(manhã|tarde|noite)/g
    ];

    for (const pattern of timePatterns) {
      const match = message.match(pattern);
      if (match) {
        if (match[0].includes('manhã')) return '08:00';
        if (match[0].includes('tarde')) return '14:00';
        if (match[0].includes('noite')) return '20:00';
        
        // Formatar horário
        const time = match[0].replace(/[^\d:]/g, '');
        if (time.includes(':')) return time;
        return `${time}:00`;
      }
    }

    return '08:00'; // Horário padrão
  }

  private extractDate(message: string): string {
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    
    if (message.includes('amanhã')) {
      return tomorrow.toISOString().split('T')[0];
    }
    
    if (message.includes('hoje')) {
      return today.toISOString().split('T')[0];
    }

    return today.toISOString().split('T')[0]; // Data padrão
  }

  private extractFrequency(message: string): string {
    if (message.includes('diário') || message.includes('todo dia')) {
      return 'daily';
    }
    
    if (message.includes('semanal')) {
      return 'weekly';
    }
    
    if (message.includes('mensal')) {
      return 'monthly';
    }

    return 'daily'; // Frequência padrão
  }

  private buildReminderData(extractedInfo: IntentAnalysis['extractedInfo']): Partial<HealthReminder> {
    const data: Partial<HealthReminder> = {
      isActive: true,
      scheduledDate: new Date(extractedInfo?.date || new Date()),
      time: extractedInfo?.time || '08:00',
      recurring: true,
      recurringType: (extractedInfo?.frequency as any) || 'daily'
    };

    if (extractedInfo?.medication) {
      data.title = `Tomar ${extractedInfo.medication}`;
      data.description = `Lembrete para tomar ${extractedInfo.medication}`;
      data.type = 'medication';
    } else if (extractedInfo?.appointment) {
      data.title = `Consulta: ${extractedInfo.appointment}`;
      data.description = `Lembrete de consulta médica`;
      data.type = 'appointment';
      data.recurring = false;
    } else if (extractedInfo?.exam) {
      data.title = `Exame: ${extractedInfo.exam}`;
      data.description = `Lembrete de exame médico`;
      data.type = 'exam';
      data.recurring = false;
    } else {
      data.title = 'Lembrete de saúde';
      data.description = 'Lembrete geral de saúde';
      data.type = 'general';
    }

    return data;
  }

  generateReminderConfirmation(reminderData: Partial<HealthReminder>): string {
    const { title, type, time, scheduledDate } = reminderData;
    
    let confirmation = `Entendi! Vou criar um lembrete para "${title}"`;
    
    if (scheduledDate) {
      const date = new Date(scheduledDate).toLocaleDateString('pt-BR');
      confirmation += ` no dia ${date}`;
    }
    
    if (time) {
      confirmation += ` às ${time}`;
    }
    
    if (type === 'medication') {
      confirmation += `. Este lembrete será diário para você não esquecer de tomar seu medicamento.`;
    } else if (type === 'appointment') {
      confirmation += `. Não esqueça de levar seus documentos e exames.`;
    } else if (type === 'exam') {
      confirmation += `. Lembre-se de seguir as orientações de jejum se necessário.`;
    }
    
    confirmation += `\n\nDeseja que eu configure este lembrete agora?`;
    
    return confirmation;
  }
}

export const intentService = new IntentService();
