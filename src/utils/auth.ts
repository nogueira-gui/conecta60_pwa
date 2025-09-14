// Simulação de autenticação para Sprint 1
// Em produção, isso seria conectado a um backend real

export interface User {
  id: string;
  name: string;
  email: string;
}

// Usuários simulados para demonstração
const DEMO_USERS = [
  {
    id: '1',
    name: 'Clóvis Silva',
    email: 'clovis@exemplo.com',
    password: '123456'
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@exemplo.com',
    password: '123456'
  }
];

export class AuthService {
  private static readonly STORAGE_KEY = 'conecta60_user';
  private static readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 horas

  static async login(email: string, password: string): Promise<User> {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = DEMO_USERS.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('E-mail ou senha incorretos');
    }

    const sessionData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      timestamp: Date.now()
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData));
    
    return sessionData.user;
  }

  static logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  static getCurrentUser(): User | null {
    try {
      const sessionData = localStorage.getItem(this.STORAGE_KEY);
      if (!sessionData) return null;

      const { user, timestamp } = JSON.parse(sessionData);
      
      // Verifica se a sessão expirou
      if (Date.now() - timestamp > this.SESSION_DURATION) {
        this.logout();
        return null;
      }

      return user;
    } catch {
      this.logout();
      return null;
    }
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}