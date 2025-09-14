import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './components/Dashboard';
import { InstallPrompt } from './components/InstallPrompt';
import { OfflineIndicator } from './components/OfflineIndicator';
import { AuthService, User } from './utils/auth';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Verifica se há usuário logado ao carregar a aplicação
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError('');

    try {
      const loggedUser = await AuthService.login(email, password);
      setUser(loggedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <OfflineIndicator />
      {user && <Header user={user} onLogout={handleLogout} />}
      
      {!user ? (
        <LoginForm 
          onLogin={handleLogin}
          loading={loading}
          error={error}
        />
      ) : (
        <Dashboard user={user} />
      )}
      
      <InstallPrompt />
    </div>
  );
}

export default App;