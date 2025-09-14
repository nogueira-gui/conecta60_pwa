import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { PWAService } from '../utils/pwa';

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verifica se já está instalado
    setIsInstalled(PWAService.isInstalled());

    // Configura o prompt de instalação
    PWAService.setupInstallPrompt();

    // Verifica periodicamente se pode instalar
    const checkInstall = setInterval(() => {
      if (PWAService.canInstall() && !isInstalled) {
        setShowPrompt(true);
      }
    }, 2000);

    return () => clearInterval(checkInstall);
  }, [isInstalled]);

  const handleInstall = async () => {
    await PWAService.installPWA();
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-6 right-6 bg-blue-600 text-white p-6 rounded-2xl shadow-2xl z-50 max-w-md mx-auto">
      <div className="flex items-start gap-4">
        <div className="bg-white bg-opacity-20 p-3 rounded-xl">
          <Download className="h-8 w-8" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">Instalar Conecta60+</h3>
          <p className="text-lg text-blue-100 mb-4">
            Instale o aplicativo no seu celular para acesso mais fácil e rápido!
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleInstall}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors duration-200"
            >
              Instalar
            </button>
            <button
              onClick={handleDismiss}
              className="bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-800 transition-colors duration-200"
            >
              Agora não
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-blue-200 hover:text-white transition-colors duration-200"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}