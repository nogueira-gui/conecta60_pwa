import React, { useState } from 'react';
import { 
  X, 
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

interface ReminderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reminder: HealthReminder) => void;
  initialData?: Partial<HealthReminder>;
}

export default function ReminderFormModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData 
}: ReminderFormModalProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    type: initialData?.type || 'medication' as 'medication' | 'appointment' | 'exam' | 'general',
    scheduledDate: initialData?.scheduledDate ? 
      initialData.scheduledDate.toISOString().split('T')[0] : 
      new Date().toISOString().split('T')[0],
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
      icon: <Pill className="w-4 h-4" />,
      color: 'bg-blue-100 text-blue-600 border-blue-200'
    },
    { 
      value: 'appointment', 
      label: 'Consulta', 
      icon: <Stethoscope className="w-4 h-4" />,
      color: 'bg-green-100 text-green-600 border-green-200'
    },
    { 
      value: 'exam', 
      label: 'Exame', 
      icon: <TestTube className="w-4 h-4" />,
      color: 'bg-purple-100 text-purple-600 border-purple-200'
    },
    { 
      value: 'general', 
      label: 'Geral', 
      icon: <AlertCircle className="w-4 h-4" />,
      color: 'bg-orange-100 text-orange-600 border-orange-200'
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
      onSave(newReminder);
      onClose();
    } catch (err) {
      console.error('Erro ao criar lembrete:', err);
      setError('Erro ao criar lembrete. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Criar Lembrete</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Tomar Losartana 50mg"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Detalhes adicionais..."
            />
          </div>

          {/* Tipo de Lembrete */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <div className="grid grid-cols-2 gap-2">
              {reminderTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleInputChange('type', type.value)}
                  className={`p-3 rounded-lg border-2 transition-all text-sm ${
                    formData.type === type.value
                      ? `${type.color} border-current`
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {type.icon}
                    <span>{type.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Data e Hora */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-3 h-3 inline mr-1" />
                Data
              </label>
              <input
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="w-3 h-3 inline mr-1" />
                Horário
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Recorrência */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="recurring"
                checked={formData.recurring}
                onChange={(e) => handleInputChange('recurring', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="recurring" className="flex items-center gap-1 text-sm font-medium text-gray-700">
                <RotateCcw className="w-3 h-3" />
                Recorrente
              </label>
            </div>

            {formData.recurring && (
              <div>
                <select
                  value={formData.recurringType}
                  onChange={(e) => handleInputChange('recurringType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Ativar lembrete
            </label>
          </div>

          {/* Erro */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-3 h-3" />
                  Salvar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
