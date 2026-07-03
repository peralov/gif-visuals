import { defineConfig } from "vite";
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({
  root: "public", // Serve files from the 'public' directory
  plugins: [
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
  ],
  server: {
    // Proxy API requests to your Node.js backend
    proxy: {
      "/socket.io": {
        target: "http://localhost:8000", // Assuming your Node.js server runs on port 3000
        ws: true,
      },
      // If you have other API endpoints, add them here
      // '/api': 'http://localhost:3000',
    },
  },
  build: {
    outDir: "../dist", // Output to a 'dist' directory outside of 'public'
    emptyOutDir: true,
  },
});
