import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.omvani.app",
  appName: "OmVani",
  webDir: "dist",
  server: {
    // In production the app loads from the bundled dist folder.
    // Uncomment the line below during development to live-reload from your
    // local Vite dev server (replace with your machine's LAN IP):
    // url: "http://192.168.x.x:8080",
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 2000,
      backgroundColor: "#f7f3ee",
      showSpinner: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#6b1a1a",
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
