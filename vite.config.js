export default {
    server: {
      host: '0.0.0.0', // Allow Vite to be accessible from Docker
      port: 5173,      // Ensure frontend is running on the right port
      strictPort: true,
      watch: {
        usePolling: true // Fixes issues in some container setups
      }
    }
  };
  