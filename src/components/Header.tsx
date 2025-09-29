import React from 'react';
import { Shield, User, HelpCircle } from 'lucide-react';

interface HeaderProps {
  user?: {
    name: string;
  };
  onLogout?: () => void;
  onOpenSupport?: () => void;
}

export function Header({ user, onLogout, onOpenSupport }: HeaderProps) {
  return (
    <header className="bg-blue-600 text-white p-6 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-white p-3 rounded-full">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Conecta60+</h1>
            <p className="text-blue-100 text-lg">Inclusão Digital Simples e Segura</p>
          </div>
        </div>
        
        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-6 w-6" />
              <span className="text-lg font-medium">{user.name}</span>
            </div>
            <button
              onClick={onOpenSupport}
              className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              Suporte
            </button>
            <button
              onClick={onLogout}
              className="bg-blue-700 hover:bg-blue-800 px-6 py-3 rounded-lg text-lg font-medium transition-colors duration-200"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}