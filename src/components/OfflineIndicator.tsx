import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showOfflineMessage) {
    return null;
  }

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 p-4 text-center text-white transition-all duration-300 ${
      isOnline ? 'bg-green-600' : 'bg-red-600'
    }`}>
      <div className="flex items-center justify-center gap-3">
        {isOnline ? (
          <>
            <Wifi className="h-6 w-6" />
            <span className="text-lg font-medium">Conexão restaurada!</span>
          </>
        ) : (
          <>
            <WifiOff className="h-6 w-6" />
            <span className="text-lg font-medium">Sem conexão - Modo offline ativo</span>
          </>
        )}
      </div>
    </div>
  );
}