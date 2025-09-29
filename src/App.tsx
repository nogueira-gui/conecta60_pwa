import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './components/Dashboard';
import { InstallPrompt } from './components/InstallPrompt';
import { OfflineIndicator } from './components/OfflineIndicator';
import HealthDashboard from './components/Health/HealthDashboard';
import ReminderForm from './components/Health/ReminderForm';
import CommunicationDashboard from './components/Communication/CommunicationDashboard';
import AIChat from './components/Communication/AIChat';
import NavigationBreadcrumb from './components/NavigationBreadcrumb';
import SupportDashboard from './components/Support/SupportDashboard';
import { AuthService, User } from './utils/auth';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSupport, setShowSupport] = useState(false);

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
    <Router>
      <div className="min-h-screen bg-gray-50">
        <OfflineIndicator />
        {user && <Header user={user} onLogout={handleLogout} onOpenSupport={() => setShowSupport(true)} />}
        {user && <NavigationBreadcrumb />}
        
        {!user ? (
          <LoginForm 
            onLogin={handleLogin}
            loading={loading}
            error={error}
          />
        ) : (
          <Routes>
            <Route path="/" element={<Dashboard user={user} onOpenSupport={() => setShowSupport(true)} />} />
            <Route path="/saude" element={<HealthDashboard />} />
            <Route path="/saude/lembrete" element={<ReminderForm />} />
            <Route path="/comunicacao" element={<CommunicationDashboard />} />
            <Route path="/chat-ia" element={<AIChat enableFamilySimulation={true} showBackButton={true} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
        
        <InstallPrompt />
        
        {/* Support Dashboard */}
        {showSupport && (
          <SupportDashboard onClose={() => setShowSupport(false)} />
        )}
      </div>
    </Router>
  );
}

export default App;