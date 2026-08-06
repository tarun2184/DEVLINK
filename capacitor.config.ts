import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.devlink.app',
  appName: 'DevLink App',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
