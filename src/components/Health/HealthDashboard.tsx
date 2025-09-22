import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Pill, AlertTriangle, Phone, Heart, Activity, ArrowLeft, Plus } from 'lucide-react';
import { healthService } from '../../services/healthService';
import { MedicalAppointment, HealthReminder, EmergencyContact } from '../../types/health';
import { format, isToday, isTomorrow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function HealthDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<MedicalAppointment[]>([]);
  const [reminders, setReminders] = useState<HealthReminder[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  useEffect(() => {
    loadHealthData();
  }, []);

  const loadHealthData = async () => {
    try {
      setLoading(true);
      const [appointmentsData, remindersData, contactsData] = await Promise.all([
        healthService.getMedicalAppointments('patient_1'),
        healthService.getHealthReminders('patient_1'),
        healthService.getEmergencyContacts('patient_1')
      ]);

      setAppointments(appointmentsData);
      setReminders(remindersData);
      setEmergencyContacts(contactsData);
    } catch (error) {
      console.error('Erro ao carregar dados de saúde:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUpcomingAppointments = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return appointments.filter(apt => 
      apt.status === 'agendado' && 
      apt.date >= today && 
      apt.date <= nextWeek
    );
  };

  const getTodaysReminders = () => {
    return reminders.filter(reminder => 
      reminder.isActive && 
      isToday(reminder.scheduledDate)
    );
  };

  const handleEmergencyAlert = async () => {
    try {
      await healthService.sendEmergencyAlert('patient_1', 'Alerta de emergência enviado pelo usuário');
      setShowEmergencyModal(false);
      alert('Alerta de emergência enviado para seus contatos!');
    } catch (error) {
      console.error('Erro ao enviar alerta:', error);
      alert('Erro ao enviar alerta de emergência');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-2 rounded-lg transition-colors"
            title="Voltar ao início"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Saúde</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/saude/lembrete')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Lembrete
          </button>
          <button
            onClick={() => setShowEmergencyModal(true)}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <AlertTriangle className="w-5 h-5" />
            Emergência
          </button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Consultas Próximas</p>
              <p className="text-2xl font-bold text-blue-800">
                {getUpcomingAppointments().length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-3">
            <Pill className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Lembretes Hoje</p>
              <p className="text-2xl font-bold text-green-800">
                {getTodaysReminders().length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center gap-3">
            <Phone className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Contatos Emergência</p>
              <p className="text-2xl font-bold text-purple-800">
                {emergencyContacts.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Próximas Consultas */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Próximas Consultas
        </h2>
        
        {getUpcomingAppointments().length === 0 ? (
          <p className="text-gray-500 text-center py-4">Nenhuma consulta agendada para os próximos 7 dias</p>
        ) : (
          <div className="space-y-3">
            {getUpcomingAppointments().map((appointment) => (
              <div key={appointment.id} className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{appointment.doctorName}</p>
                      <p className="text-sm text-gray-600">{appointment.specialty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">
                      {format(appointment.date, 'dd/MM', { locale: ptBR })}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {appointment.time}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">{appointment.location}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lembretes de Hoje */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Pill className="w-5 h-5" />
          Lembretes de Hoje
        </h2>
        
        {getTodaysReminders().length === 0 ? (
          <p className="text-gray-500 text-center py-4">Nenhum lembrete para hoje</p>
        ) : (
          <div className="space-y-3">
            {getTodaysReminders().map((reminder) => (
              <div key={reminder.id} className="border border-gray-100 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <Activity className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{reminder.title}</p>
                      <p className="text-sm text-gray-600">{reminder.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">{reminder.time}</p>
                    <span className="inline-block px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                      {reminder.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Emergência */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Alerta de Emergência
            </h3>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja enviar um alerta de emergência? 
              Seus contatos de emergência serão notificados imediatamente.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleEmergencyAlert}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Enviar Alerta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
