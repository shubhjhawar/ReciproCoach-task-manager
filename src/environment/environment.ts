
  export const environment = {
    production: false,
    apiBaseUrl: 'https://reciprocoach-task-manager-backend.onrender.com/', // Example API base URL
    hostURL: 'http://localhost:4200',
    onDemand: {
      baseUrl: 'https://reciprocoach-task-manager-backend.onrender.com/', // Example on-demand service base URL
      apiAuth: '', // Your API authentication token (if required)
      clientId: '', // Your client ID for authentication (if required)
      secret: '', // Your secret key for authentication (if required)
    },
    firebaseConfig: { // Example Firebase configuration (if you're using Firebase)
      apiKey: 'YOUR_API_KEY',
      authDomain: 'YOUR_AUTH_DOMAIN',
      projectId: 'YOUR_PROJECT_ID',
      storageBucket: 'YOUR_STORAGE_BUCKET',
      messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
      appId: 'YOUR_APP_ID',
      measurementId: 'YOUR_MEASUREMENT_ID' // Optional: Add this line if you're using Firebase Analytics
    },
    // Add other environment variables as needed
  };
  