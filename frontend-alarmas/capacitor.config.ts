import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.alarmasmart.app',
  appName: 'AlarmaSmart',
  webDir: 'build',

  server: {
    androidScheme: 'http',   // 🔥 CLAVE ABSOLUTA
    cleartext: true,
    allowNavigation: [
      '192.168.0.18',
      '192.168.0.18:3000'
    ]
  }
};

export default config;
