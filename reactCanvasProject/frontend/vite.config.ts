// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command, mode }) => {
 const env = loadEnv(mode, process.cwd());
 return {
   plugins: [react()],
   server: {
     port: 5173,
     host: true,
     watch: {
      usePolling: true,
     },
     esbuild: {
      target: "esnext",
      platform: "linux",
    },
  },
  define: {
    VITE_APP_BACKEND_ADDRESS: JSON.stringify(env.VITE_APP_BACKEND_ADDRESS),
  },
 };
});