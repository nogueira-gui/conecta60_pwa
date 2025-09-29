import React, { useState } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, ArrowRight, ArrowLeft, Home, BookOpen } from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  image: string;
  action?: string;
  tip?: string;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  icon: string;
  duration: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  steps: TutorialStep[];
}

const TUTORIALS: Tutorial[] = [
  {
    id: 'login',
    title: 'Como fazer seu primeiro login',
    description: 'Aprenda a acessar o Conecta60+ pela primeira vez',
    icon: '🔐',
    duration: '3 min',
    difficulty: 'Fácil',
    steps: [
      {
        id: 'step1',
        title: 'Abrir o aplicativo',
        description: 'Toque no ícone do Conecta60+ na tela inicial do seu celular',
        image: '/tutorials/login-step1.png',
        action: 'Toque no ícone do app'
      },
      {
        id: 'step2',
        title: 'Tela de boas-vindas',
        description: 'Você verá a tela de boas-vindas. Toque em "Começar" para continuar',
        image: '/tutorials/login-step2.png',
        action: 'Toque em "Começar"'
      },
      {
        id: 'step3',
        title: 'Inserir CPF',
        description: 'Digite seu CPF no campo indicado. Use apenas números',
        image: '/tutorials/login-step3.png',
        action: 'Digite seu CPF',
        tip: 'Digite apenas os números, sem pontos ou traços'
      },
      {
        id: 'step4',
        title: 'Criar senha',
        description: 'Crie uma senha segura mas fácil de lembrar. Use pelo menos 6 caracteres',
        image: '/tutorials/login-step4.png',
        action: 'Digite sua senha',
        tip: 'Anote sua senha em local seguro'
      },
      {
        id: 'step5',
        title: 'Confirmar cadastro',
        description: 'Toque em "Confirmar" para finalizar seu cadastro',
        image: '/tutorials/login-step5.png',
        action: 'Toque em "Confirmar"'
      }
    ]
  },
  {
    id: 'agendar-consulta',
    title: 'Como agendar uma consulta médica',
    description: 'Aprenda a marcar consultas médicas pelo aplicativo',
    icon: '🏥',
    duration: '5 min',
    difficulty: 'Fácil',
    steps: [
      {
        id: 'step1',
        title: 'Acessar módulo Saúde',
        description: 'Na tela inicial, toque no ícone "Saúde" (ícone de cruz médica)',
        image: '/tutorials/health-step1.png',
        action: 'Toque em "Saúde"'
      },
      {
        id: 'step2',
        title: 'Escolher agendar consulta',
        description: 'Toque em "Agendar Consulta" na tela do módulo de saúde',
        image: '/tutorials/health-step2.png',
        action: 'Toque em "Agendar Consulta"'
      },
      {
        id: 'step3',
        title: 'Selecionar especialidade',
        description: 'Escolha a especialidade médica que você precisa (clínico geral, cardiologista, etc.)',
        image: '/tutorials/health-step3.png',
        action: 'Escolha a especialidade'
      },
      {
        id: 'step4',
        title: 'Escolher data e horário',
        description: 'Selecione uma data e horário disponível que funcione para você',
        image: '/tutorials/health-step4.png',
        action: 'Selecione data e horário'
      },
      {
        id: 'step5',
        title: 'Confirmar agendamento',
        description: 'Revise as informações e toque em "Confirmar" para finalizar',
        image: '/tutorials/health-step5.png',
        action: 'Toque em "Confirmar"'
      }
    ]
  },
  {
    id: 'chamada-video',
    title: 'Como fazer uma chamada de vídeo',
    description: 'Aprenda a fazer chamadas de vídeo com familiares',
    icon: '📹',
    duration: '4 min',
    difficulty: 'Fácil',
    steps: [
      {
        id: 'step1',
        title: 'Acessar Comunicação',
        description: 'Na tela inicial, toque no ícone "Comunicação" (ícone de telefone)',
        image: '/tutorials/comm-step1.png',
        action: 'Toque em "Comunicação"'
      },
      {
        id: 'step2',
        title: 'Escolher contato',
        description: 'Na lista de contatos, toque no nome da pessoa que você quer chamar',
        image: '/tutorials/comm-step2.png',
        action: 'Toque no contato desejado'
      },
      {
        id: 'step3',
        title: 'Iniciar chamada de vídeo',
        description: 'Toque no ícone de vídeo (câmera) para iniciar a chamada',
        image: '/tutorials/comm-step3.png',
        action: 'Toque no ícone de vídeo'
      },
      {
        id: 'step4',
        title: 'Aguardar conexão',
        description: 'Aguarde a pessoa atender. Você verá "Chamando..." na tela',
        image: '/tutorials/comm-step4.png',
        action: 'Aguarde a conexão'
      },
      {
        id: 'step5',
        title: 'Falar com a pessoa',
        description: 'Quando a pessoa atender, você poderá vê-la e falar com ela',
        image: '/tutorials/comm-step5.png',
        action: 'Converse normalmente'
      }
    ]
  }
];

interface TutorialSectionProps {
  onBack: () => void;
}

const TutorialSection: React.FC<TutorialSectionProps> = ({ onBack }) => {
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const startTutorial = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const nextStep = () => {
    if (selectedTutorial && currentStep < selectedTutorial.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetTutorial = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'text-green-600 bg-green-100';
      case 'Médio': return 'text-yellow-600 bg-yellow-100';
      case 'Difícil': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (selectedTutorial) {
    const currentStepData = selectedTutorial.steps[currentStep];
    const progress = ((currentStep + 1) / selectedTutorial.steps.length) * 100;

    return (
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setSelectedTutorial(null)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">{selectedTutorial.title}</h1>
            <p className="text-gray-600">{selectedTutorial.description}</p>
          </div>
          <div className="w-24"></div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Passo {currentStep + 1} de {selectedTutorial.steps.length}</span>
            <span>{Math.round(progress)}% concluído</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Tutorial Content */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{selectedTutorial.icon}</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {currentStepData.title}
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              {currentStepData.description}
            </p>
            {currentStepData.tip && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                  <strong>Dica:</strong> {currentStepData.tip}
                </p>
              </div>
            )}
          </div>

          {/* Simulated Image */}
          <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center mb-6">
            <div className="text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Imagem do tutorial</p>
              <p className="text-sm text-gray-400">{currentStepData.image}</p>
            </div>
          </div>

          {currentStepData.action && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 font-medium">
                <strong>Ação:</strong> {currentStepData.action}
              </p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlay}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pausar' : 'Reproduzir'}</span>
            </button>

            <button
              onClick={resetTutorial}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Recomeçar</span>
            </button>
          </div>

          <button
            onClick={nextStep}
            disabled={currentStep === selectedTutorial.steps.length - 1}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
          >
            <span>Próximo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Completion */}
        {currentStep === selectedTutorial.steps.length - 1 && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-800 mb-2">
              Parabéns! Tutorial concluído
            </h3>
            <p className="text-green-700 mb-4">
              Você aprendeu como {selectedTutorial.title.toLowerCase()}
            </p>
            <button
              onClick={() => setSelectedTutorial(null)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Voltar aos Tutoriais
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Tutoriais Interativos</h1>
          <p className="text-lg text-gray-600">Aprenda a usar o Conecta60+ passo a passo</p>
        </div>
        <div className="w-24"></div>
      </div>

      {/* Tutorials Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TUTORIALS.map((tutorial) => (
          <div
            key={tutorial.id}
            className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => startTutorial(tutorial)}
          >
            <div className="p-6">
              <div className="text-center mb-4">
                <div className="text-6xl mb-4">{tutorial.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {tutorial.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {tutorial.description}
                </p>
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">
                  ⏱️ {tutorial.duration}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
                  {tutorial.difficulty}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {tutorial.steps.length} passos
                </span>
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                  <Play className="w-4 h-4" />
                  <span>Começar</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Start */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Primeira vez usando o app?
        </h3>
        <p className="text-gray-600 text-center mb-6">
          Comece com o tutorial de login para aprender o básico
        </p>
        <div className="text-center">
          <button
            onClick={() => startTutorial(TUTORIALS[0])}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
          >
            Começar Tutorial de Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialSection;
