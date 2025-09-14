import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  loading?: boolean;
  error?: string;
}

export function LoginForm({ onLogin, loading, error }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-10 w-10 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo!</h2>
          <p className="text-xl text-gray-600">Entre na sua conta</p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <p className="text-red-700 text-lg">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-xl font-medium text-gray-700 mb-3">
              E-mail
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-16 pl-14 pr-4 text-xl border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                placeholder="Digite seu e-mail"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xl font-medium text-gray-700 mb-3">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-16 pl-14 pr-14 text-xl border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                placeholder="Digite sua senha"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                {showPassword ? (
                  <EyeOff className="h-6 w-6" />
                ) : (
                  <Eye className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-16 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xl font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 focus:ring-4 focus:ring-blue-200"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-8 space-y-4">
          <button className="w-full h-14 text-blue-600 hover:text-blue-700 text-lg font-medium hover:bg-blue-50 rounded-lg transition-colors duration-200">
            Esqueci minha senha
          </button>
          <button className="w-full h-14 text-gray-600 hover:text-gray-700 text-lg font-medium hover:bg-gray-50 rounded-lg transition-colors duration-200">
            Precisa de ajuda?
          </button>
        </div>
      </div>
    </div>
  );
}