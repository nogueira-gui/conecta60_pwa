import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Calendar, 
  Clock, 
  Pill, 
  Stethoscope, 
  TestTube,
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import { healthService } from '../../services/healthService';
import { HealthReminder } from '../../types/health';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReminderFormProps {
  initialData?: Partial<HealthReminder>;
  onSave?: (reminder: HealthReminder) => void;
  onCancel?: () => void;
}

export default function ReminderForm({ 
  initialData, 
  onSave, 
  onCancel 
}: ReminderFormProps) {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    type: initialData?.type || 'medication' as 'medication' | 'appointment' | 'exam' | 'general',
    scheduledDate: initialData?.scheduledDate ? format(initialData.scheduledDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    time: initialData?.time || '08:00',
    isActive: initialData?.isActive ?? true,
    recurring: initialData?.recurring ?? false,
    recurringType: initialData?.recurringType || 'daily' as 'daily' | 'weekly' | 'monthly'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const reminderTypes = [
    { 
      value: 'medication', 
      label: 'Medicamento', 
      icon: <Pill className="w-5 h-5" />,
      color: 'bg-blue-100 text-blue-600 border-blue-200',
      description: 'Lembrete para tomar medicamentos'
    },
    { 
      value: 'appointment', 
      label: 'Consulta', 
      icon: <Stethoscope className="w-5 h-5" />,
      color: 'bg-green-100 text-green-600 border-green-200',
      description: 'Lembrete de consulta médica'
    },
    { 
      value: 'exam', 
      label: 'Exame', 
      icon: <TestTube className="w-5 h-5" />,
      color: 'bg-purple-100 text-purple-600 border-purple-200',
      description: 'Lembrete de exame médico'
    },
    { 
      value: 'general', 
      label: 'Geral', 
      icon: <AlertCircle className="w-5 h-5" />,
      color: 'bg-orange-100 text-orange-600 border-orange-200',
      description: 'Lembrete geral de saúde'
    }
  ];

  const recurringOptions = [
    { value: 'daily', label: 'Diário' },
    { value: 'weekly', label: 'Semanal' },
    { value: 'monthly', label: 'Mensal' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('O título do lembrete é obrigatório');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const reminderData = {
        patientId: 'patient_1',
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        scheduledDate: new Date(formData.scheduledDate),
        time: formData.time,
        isActive: formData.isActive,
        recurring: formData.recurring,
        recurringType: formData.recurring ? formData.recurringType : undefined
      };

      const newReminder = await healthService.createHealthReminder(reminderData);
      
      if (onSave) {
        onSave(newReminder);
      } else {
        // Redirecionar para a página de saúde após salvar
        navigate('/saude');
      }
    } catch (err) {
      console.error('Erro ao criar lembrete:', err);
      setError('Erro ao criar lembrete. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/saude');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-2 rounded-lg transition-colors"
            title="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Criar Lembrete</h1>
            <p className="text-gray-600">Configure um novo lembrete de saúde</p>
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título do Lembrete *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="Ex: Tomar Losartana 50mg"
                required
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Detalhes adicionais sobre o lembrete..."
              />
            </div>

            {/* Tipo de Lembrete */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tipo de Lembrete
              </label>
              <div className="grid grid-cols-2 gap-3">
                {reminderTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleInputChange('type', type.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.type === type.value
                        ? `${type.color} border-current`
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {type.icon}
                      <div className="text-left">
                        <p className="font-medium">{type.label}</p>
                        <p className="text-xs opacity-75">{type.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Data e Hora */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Data
                </label>
                <input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Horário
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Recorrência */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={formData.recurring}
                  onChange={(e) => handleInputChange('recurring', e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="recurring" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <RotateCcw className="w-4 h-4" />
                  Lembrete recorrente
                </label>
              </div>

              {formData.recurring && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequência
                  </label>
                  <select
                    value={formData.recurringType}
                    onChange={(e) => handleInputChange('recurringType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {recurringOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Status Ativo */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Ativar lembrete imediatamente
              </label>
            </div>

            {/* Erro */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Salvar Lembrete
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
