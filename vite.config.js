import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/ — base is '/' locally & on Vercel/Netlify/Cloudflare,
// but must be '/PORTFOLIO/' on GitHub Pages project site https://Lealene.github.io/PORTFOLIO/
// so /profile.jpg, /favicon.svg etc. (index.html:5, src/App.jsx:109,715) don't 404.
// See docs/research/2026-09-15-deployment-options.md and https://vite.dev/guide/static-deploy
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? '/PORTFOLIO/' : '/',
})
