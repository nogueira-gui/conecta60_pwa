// Utilitários para PWA
export class PWAService {
  private static deferredPrompt: any = null;

  // Registrar Service Worker
  static async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registrado com sucesso:', registration);
      } catch (error) {
        console.log('Falha ao registrar Service Worker:', error);
      }
    }
  }

  // Configurar prompt de instalação
  static setupInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Previne o prompt automático
      e.preventDefault();
      // Salva o evento para usar depois
      this.deferredPrompt = e;
      // Mostra o botão de instalação
      this.showInstallButton();
    });

    window.addEventListener('appinstalled', () => {
      console.log('PWA foi instalado');
      this.hideInstallButton();
    });
  }

  // Mostrar botão de instalação
  private static showInstallButton(): void {
    const installButton = document.getElementById('install-button');
    if (installButton) {
      installButton.style.display = 'block';
    }
  }

  // Esconder botão de instalação
  private static hideInstallButton(): void {
    const installButton = document.getElementById('install-button');
    if (installButton) {
      installButton.style.display = 'none';
    }
  }

  // Instalar PWA
  static async installPWA(): Promise<void> {
    if (this.deferredPrompt) {
      // Mostra o prompt de instalação
      this.deferredPrompt.prompt();
      
      // Aguarda a escolha do usuário
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('Usuário aceitou instalar o PWA');
      } else {
        console.log('Usuário recusou instalar o PWA');
      }
      
      // Limpa o prompt
      this.deferredPrompt = null;
    }
  }

  // Verificar se está instalado
  static isInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }

  // Verificar se pode ser instalado
  static canInstall(): boolean {
    return this.deferredPrompt !== null;
  }
}