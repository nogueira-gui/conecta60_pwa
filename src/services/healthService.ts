import { 
  MedicalAppointment, 
  MedicalRecord, 
  HealthReminder, 
  EmergencyContact, 
  SUSIntegration, 
  Exam, 
  Vaccination 
} from '../types/health';

// Dados mockados para demonstração
const mockMedicalAppointments: MedicalAppointment[] = [
  {
    id: '1',
    patientId: 'patient_1',
    doctorName: 'Dr. João Silva',
    specialty: 'Cardiologia',
    date: new Date('2024-01-15'),
    time: '14:00',
    location: 'Hospital São Lucas',
    status: 'agendado',
    notes: 'Consulta de rotina - pressão alta'
  },
  {
    id: '2',
    patientId: 'patient_1',
    doctorName: 'Dra. Maria Santos',
    specialty: 'Clínica Geral',
    date: new Date('2024-01-20'),
    time: '10:30',
    location: 'UBS Centro',
    status: 'agendado',
    notes: 'Retorno - diabetes'
  }
];

const mockMedicalRecords: MedicalRecord[] = [
  {
    id: '1',
    patientId: 'patient_1',
    date: new Date('2023-12-10'),
    doctorName: 'Dr. João Silva',
    specialty: 'Cardiologia',
    diagnosis: 'Hipertensão arterial',
    treatment: 'Controle da pressão arterial',
    prescriptions: [
      {
        id: '1',
        medication: 'Losartana 50mg',
        dosage: '50mg',
        frequency: '1x ao dia',
        duration: 'Contínuo',
        instructions: 'Tomar pela manhã'
      }
    ],
    attachments: []
  }
];

const mockHealthReminders: HealthReminder[] = [
  {
    id: '1',
    patientId: 'patient_1',
    title: 'Tomar Losartana',
    description: 'Medicamento para pressão alta',
    type: 'medication',
    scheduledDate: new Date(),
    time: '08:00',
    isActive: true,
    recurring: true,
    recurringType: 'daily'
  },
  {
    id: '2',
    patientId: 'patient_1',
    title: 'Consulta Cardiológica',
    description: 'Consulta com Dr. João Silva',
    type: 'appointment',
    scheduledDate: new Date('2024-01-15'),
    time: '14:00',
    isActive: true,
    recurring: false
  }
];

const mockEmergencyContacts: EmergencyContact[] = [
  {
    id: '1',
    name: 'Ana Silva',
    phone: '(11) 99999-9999',
    relationship: 'Filha',
    isPrimary: true
  },
  {
    id: '2',
    name: 'Carlos Silva',
    phone: '(11) 88888-8888',
    relationship: 'Filho',
    isPrimary: false
  }
];

const mockSUSData: SUSIntegration = {
  patientId: 'patient_1',
  susCard: '12345678901234567890',
  cpf: '123.456.789-00',
  appointments: mockMedicalAppointments,
  exams: [],
  vaccinations: []
};

class HealthService {
  // Agenda Médica
  async getMedicalAppointments(patientId: string): Promise<MedicalAppointment[]> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockMedicalAppointments.filter(apt => apt.patientId === patientId);
  }

  async scheduleAppointment(appointment: Omit<MedicalAppointment, 'id'>): Promise<MedicalAppointment> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newAppointment: MedicalAppointment = {
      ...appointment,
      id: `apt_${Date.now()}`
    };
    
    mockMedicalAppointments.push(newAppointment);
    return newAppointment;
  }

  async cancelAppointment(appointmentId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockMedicalAppointments.findIndex(apt => apt.id === appointmentId);
    if (index !== -1) {
      mockMedicalAppointments[index].status = 'cancelado';
      return true;
    }
    return false;
  }

  // Histórico Médico
  async getMedicalRecords(patientId: string): Promise<MedicalRecord[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockMedicalRecords.filter(record => record.patientId === patientId);
  }

  async addMedicalRecord(record: Omit<MedicalRecord, 'id'>): Promise<MedicalRecord> {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const newRecord: MedicalRecord = {
      ...record,
      id: `record_${Date.now()}`
    };
    
    mockMedicalRecords.push(newRecord);
    return newRecord;
  }

  // Lembretes de Saúde
  async getHealthReminders(patientId: string): Promise<HealthReminder[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockHealthReminders.filter(reminder => reminder.patientId === patientId);
  }

  async createHealthReminder(reminder: Omit<HealthReminder, 'id'>): Promise<HealthReminder> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newReminder: HealthReminder = {
      ...reminder,
      id: `reminder_${Date.now()}`
    };
    
    mockHealthReminders.push(newReminder);
    return newReminder;
  }

  async updateHealthReminder(reminderId: string, updates: Partial<HealthReminder>): Promise<HealthReminder | null> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = mockHealthReminders.findIndex(reminder => reminder.id === reminderId);
    if (index !== -1) {
      mockHealthReminders[index] = { ...mockHealthReminders[index], ...updates };
      return mockHealthReminders[index];
    }
    return null;
  }

  async deleteHealthReminder(reminderId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockHealthReminders.findIndex(reminder => reminder.id === reminderId);
    if (index !== -1) {
      mockHealthReminders.splice(index, 1);
      return true;
    }
    return false;
  }

  // Contatos de Emergência
  async getEmergencyContacts(patientId: string): Promise<EmergencyContact[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockEmergencyContacts;
  }

  async addEmergencyContact(contact: Omit<EmergencyContact, 'id'>): Promise<EmergencyContact> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newContact: EmergencyContact = {
      ...contact,
      id: `contact_${Date.now()}`
    };
    
    mockEmergencyContacts.push(newContact);
    return newContact;
  }

  // Integração SUS (Mockada)
  async getSUSData(patientId: string): Promise<SUSIntegration | null> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (patientId === 'patient_1') {
      return mockSUSData;
    }
    return null;
  }

  async syncWithSUS(patientId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simular sincronização com SUS
    console.log(`Sincronizando dados do paciente ${patientId} com SUS...`);
    return true;
  }

  // Exames
  async getExams(patientId: string): Promise<Exam[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockSUSData.exams.filter(exam => exam.patientId === patientId);
  }

  async scheduleExam(exam: Omit<Exam, 'id'>): Promise<Exam> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newExam: Exam = {
      ...exam,
      id: `exam_${Date.now()}`
    };
    
    mockSUSData.exams.push(newExam);
    return newExam;
  }

  // Vacinações
  async getVaccinations(patientId: string): Promise<Vaccination[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockSUSData.vaccinations.filter(vaccination => vaccination.patientId === patientId);
  }

  async addVaccination(vaccination: Omit<Vaccination, 'id'>): Promise<Vaccination> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newVaccination: Vaccination = {
      ...vaccination,
      id: `vaccination_${Date.now()}`
    };
    
    mockSUSData.vaccinations.push(newVaccination);
    return newVaccination;
  }

  // Método para simular notificações de emergência
  async sendEmergencyAlert(patientId: string, message: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const contacts = await this.getEmergencyContacts(patientId);
    console.log(`Enviando alerta de emergência: ${message}`);
    console.log(`Contatos notificados:`, contacts.map(c => c.name));
    
    return true;
  }
}

export const healthService = new HealthService();
