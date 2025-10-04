import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'api-plugin',
      configureServer(server) {
        // Middleware pour servir le fichier data.json
        server.middlewares.use('/src/data/data.json', async (req, res, next) => {
          if (req.method !== 'GET') return next()

          try {
            const fs = await import('fs/promises')
            const path = resolve(__dirname, '../src/data/data.json')
            const data = await fs.readFile(path, 'utf8')

            res.setHeader('Content-Type', 'application/json')
            res.setHeader('Cache-Control', 'no-cache')
            res.statusCode = 200
            res.end(data)
          } catch (error) {
            res.statusCode = 404
            res.end(JSON.stringify({ error: 'File not found' }))
          }
        })

        server.middlewares.use('/api/save-data', async (req, res, next) => {
          if (req.method !== 'POST') return next()

          let body = ''
          req.on('data', chunk => body += chunk)
          req.on('end', async () => {
            try {
              const { data } = JSON.parse(body)
              const fs = await import('fs/promises')
              const path = resolve(__dirname, '../src/data/data.json')
              await fs.writeFile(path, data, 'utf8')

              res.setHeader('Content-Type', 'application/json')
              res.statusCode = 200
              res.end(JSON.stringify({ success: true }))
            } catch (error) {
              res.statusCode = 500
              res.end(JSON.stringify({ error: error.message }))
            }
          })
        })
      }
    }
  ],
  root: resolve(__dirname),
  base: './',
  server: {
    port: 3001,
    open: '/index-vue.html',
    fs: {
      // Permettre l'accès aux fichiers du projet parent
      allow: ['..']
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'index-vue.html')
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src')
    }
  },
  // Servir les fichiers statiques du projet parent
  publicDir: false
})
