// Tipos para o módulo de saúde
export interface MedicalAppointment {
  id: string;
  patientId: string;
  doctorName: string;
  specialty: string;
  date: Date;
  time: string;
  location: string;
  status: 'agendado' | 'realizado' | 'cancelado';
  notes?: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  date: Date;
  doctorName: string;
  specialty: string;
  diagnosis: string;
  treatment: string;
  prescriptions: Prescription[];
  attachments: string[];
}

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface HealthReminder {
  id: string;
  patientId: string;
  title: string;
  description: string;
  type: 'medication' | 'appointment' | 'exam' | 'general';
  scheduledDate: Date;
  time: string;
  isActive: boolean;
  recurring: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly';
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

export interface SUSIntegration {
  patientId: string;
  susCard: string;
  cpf: string;
  appointments: MedicalAppointment[];
  exams: Exam[];
  vaccinations: Vaccination[];
}

export interface Exam {
  id: string;
  patientId: string;
  name: string;
  type: string;
  scheduledDate: Date;
  location: string;
  status: 'agendado' | 'realizado' | 'cancelado';
  results?: string;
  attachments: string[];
}

export interface Vaccination {
  id: string;
  patientId: string;
  vaccine: string;
  date: Date;
  location: string;
  batch: string;
  nextDose?: Date;
}
