import React, { useState } from 'react';
import { Phone, Video, MessageCircle, Clock, User, CheckCircle, AlertCircle, Calendar } from 'lucide-react';

interface SupportRequest {
  id: string;
  type: 'phone' | 'video' | 'chat';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  subject: string;
  description: string;
  estimatedWait: string;
  status: 'pending' | 'scheduled' | 'in-progress' | 'completed';
  scheduledTime?: Date;
}

interface HumanSupportProps {
  onClose: () => void;
}

const HumanSupport: React.FC<HumanSupportProps> = ({ onClose }) => {
  const [selectedType, setSelectedType] = useState<'phone' | 'video' | 'chat' | null>(null);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [supportRequest, setSupportRequest] = useState<SupportRequest | null>(null);

  const supportTypes = [
    {
      id: 'phone' as const,
      title: 'Ligação Telefônica',
      description: 'Fale diretamente com nosso especialista',
      icon: Phone,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      estimatedTime: '2-5 minutos'
    },
    {
      id: 'video' as const,
      title: 'Chamada de Vídeo',
      description: 'Veja e fale com nosso especialista',
      icon: Video,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      estimatedTime: '5-10 minutos'
    },
    {
      id: 'chat' as const,
      title: 'Chat com Especialista',
      description: 'Conversa por texto com especialista',
      icon: MessageCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      estimatedTime: '3-7 minutos'
    }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Baixa', color: 'text-green-600', bgColor: 'bg-green-100' },
    { value: 'medium', label: 'Média', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { value: 'high', label: 'Alta', color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { value: 'urgent', label: 'Urgente', color: 'text-red-600', bgColor: 'bg-red-100' }
  ];

  const getWaitTime = (type: string, priority: string) => {
    const baseTimes = {
      phone: { low: '5-10 min', medium: '3-7 min', high: '1-3 min', urgent: 'Imediato' },
      video: { low: '10-15 min', medium: '7-12 min', high: '3-7 min', urgent: '1-3 min' },
      chat: { low: '3-7 min', medium: '2-5 min', high: '1-3 min', urgent: 'Imediato' }
    };
    return baseTimes[type as keyof typeof baseTimes]?.[priority as keyof typeof baseTimes.phone] || '5-10 min';
  };

  const handleSubmitRequest = () => {
    if (!selectedType || !subject.trim() || !description.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const request: SupportRequest = {
      id: Date.now().toString(),
      type: selectedType,
      priority,
      subject: subject.trim(),
      description: description.trim(),
      estimatedWait: getWaitTime(selectedType, priority),
      status: 'pending'
    };

    setSupportRequest(request);
    setRequestSubmitted(true);
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'high': return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  if (requestSubmitted && supportRequest) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
          <div className="p-6">
            <div className="text-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Solicitação Enviada!
              </h2>
              <p className="text-gray-600">
                Sua solicitação de suporte foi registrada com sucesso
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Detalhes da Solicitação</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo:</span>
                  <span className="font-medium">{supportTypes.find(t => t.id === supportRequest.type)?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Prioridade:</span>
                  <span className="font-medium">{priorityOptions.find(p => p.value === supportRequest.priority)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Assunto:</span>
                  <span className="font-medium">{supportRequest.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tempo estimado:</span>
                  <span className="font-medium text-blue-600">{supportRequest.estimatedWait}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-800 mb-2">Próximos Passos</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Você receberá uma notificação quando um especialista estiver disponível</li>
                <li>• Para chamadas telefônicas, aguarde nossa ligação</li>
                <li>• Para vídeo e chat, você será direcionado automaticamente</li>
                <li>• Número de referência: #{supportRequest.id}</li>
              </ul>
            </div>

            <div className="flex justify-between">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  setRequestSubmitted(false);
                  setSupportRequest(null);
                  setSelectedType(null);
                  setSubject('');
                  setDescription('');
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Nova Solicitação
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Suporte Humano</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Support Type Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Como você gostaria de ser atendido?
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {supportTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedType === type.id
                      ? `${type.borderColor} ${type.bgColor}`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <type.icon className={`w-8 h-8 mx-auto mb-2 ${type.color}`} />
                    <h4 className="font-semibold text-gray-800 mb-1">{type.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                    <span className="text-xs text-gray-500">⏱️ {type.estimatedTime}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedType && (
            <>
              {/* Priority Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Qual a urgência da sua solicitação?
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {priorityOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setPriority(option.value as any)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        priority === option.value
                          ? `${option.bgColor} border-current`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {getPriorityIcon(option.value)}
                        <span className="font-medium">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Request Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Detalhes da sua solicitação
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assunto *
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Ex: Problema com login, Dúvida sobre agendamento..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição detalhada *
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Descreva sua dúvida ou problema com o máximo de detalhes possível..."
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Estimated Wait Time */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-800">
                    Tempo estimado de espera: {getWaitTime(selectedType, priority)}
                  </span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Nossa equipe de especialistas entrará em contato com você em breve
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSubmitRequest}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Enviar Solicitação
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HumanSupport;
