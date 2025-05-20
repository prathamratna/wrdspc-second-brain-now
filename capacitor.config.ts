
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.aa5cb3fe5d9f45e1afcb146779e88a02',
  appName: 'wrdspc-second-brain-now',
  webDir: 'dist',
  server: {
    url: 'https://aa5cb3fe-5d9f-45e1-afcb-146779e88a02.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#ffffff",
      showSpinner: true,
      androidSpinnerStyle: "large",
      spinnerColor: "#999999"
    }
  }
};

export default config;
