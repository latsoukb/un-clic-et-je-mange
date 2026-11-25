import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' : fonctionne sur GitHub Pages (/un-clic-et-je-mange/) sans rien changer.
export default defineConfig({ base: './', plugins: [react()] })
