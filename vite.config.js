import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import configPaths from 'vite-jsconfig-paths';



export default defineConfig({
  plugins: [react(), configPaths()],
  resolve: {
    alias: { "@": path.resolve(__dirname, './src') },
  },
})

