# 🚀 Guía de Despliegue - Chatbot GRCP Argentina

Esta guía te ayudará a desplegar el chatbot de GRCP Argentina en diferentes plataformas.

## 📋 Pre-requisitos

Antes de desplegar, asegúrate de tener:

1. ✅ Una API key de Google Gemini ([Obtener aquí](https://aistudio.google.com/app/apikey))
2. ✅ El código funcionando localmente (ejecutar `pnpm dev` sin errores)
3. ✅ Una cuenta en la plataforma de despliegue elegida

---

## 🌐 Opción 1: Despliegue en Vercel (Recomendado)

Vercel es la plataforma oficial de Next.js y la más simple para desplegar.

### Pasos:

1. **Crear cuenta en Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Regístrate con tu cuenta de GitHub

2. **Importar proyecto**
   ```bash
   # Sube tu código a GitHub
   git add .
   git commit -m "Deploy: Chatbot GRCP Argentina"
   git push origin main
   ```

3. **Conectar repositorio**
   - En Vercel, haz clic en "New Project"
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente que es Next.js

4. **Configurar variables de entorno**
   - En la configuración del proyecto, ve a "Environment Variables"
   - Agrega:
     ```
     GOOGLE_GENERATIVE_AI_API_KEY=tu_api_key_aqui
     ```

5. **Desplegar**
   - Haz clic en "Deploy"
   - ¡Listo! Tu chatbot estará en línea en minutos

6. **Dominio personalizado** (Opcional)
   - Ve a "Settings" > "Domains"
   - Agrega tu dominio personalizado: `chat.grcp-arg.website`

### Ventajas de Vercel:
- ✅ Despliegue automático con cada push a GitHub
- ✅ HTTPS gratuito
- ✅ CDN global
- ✅ Vista previa de cada Pull Request
- ✅ 100% gratis para proyectos pequeños

---

## 🐳 Opción 2: Despliegue con Docker

Si prefieres tener control total o usar tu propio servidor.

### Paso 1: Crear Dockerfile

Crea un archivo `Dockerfile` en la raíz del proyecto:

```dockerfile
FROM node:20-alpine AS base

# Instalar pnpm
RUN npm install -g pnpm

# Etapa de dependencias
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Etapa de construcción
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build de Next.js
RUN pnpm build

# Etapa de producción
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos necesarios
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### Paso 2: Crear .dockerignore

```
node_modules
.next
.git
.env*.local
README.md
```

### Paso 3: Configurar next.config.ts

Asegúrate de que `next.config.ts` tenga la salida standalone:

```typescript
const nextConfig: NextConfig = {
  output: 'standalone',
  // ... resto de tu configuración
};
```

### Paso 4: Construir y ejecutar

```bash
# Construir imagen
docker build -t chatbot-grcp .

# Ejecutar contenedor
docker run -p 3000:3000 \
  -e GOOGLE_GENERATIVE_AI_API_KEY=tu_api_key_aqui \
  chatbot-grcp
```

### Paso 5: Docker Compose (Opcional)

Crea un archivo `docker-compose.yml`:

```yaml
version: '3.8'

services:
  chatbot:
    build: .
    ports:
      - "3000:3000"
    environment:
      - GOOGLE_GENERATIVE_AI_API_KEY=${GOOGLE_GENERATIVE_AI_API_KEY}
    restart: unless-stopped
```

Ejecutar con:
```bash
docker-compose up -d
```

---

## ☁️ Opción 3: AWS / Google Cloud / Azure

### AWS (EC2 + PM2)

```bash
# En tu servidor EC2
sudo apt update
sudo apt install nodejs npm

# Instalar pnpm y PM2
npm install -g pnpm pm2

# Clonar proyecto
git clone https://github.com/tu-usuario/chatbot-grcp.git
cd chatbot-grcp

# Instalar dependencias
pnpm install

# Build
pnpm build

# Configurar variables de entorno
echo "GOOGLE_GENERATIVE_AI_API_KEY=tu_key" > .env.local

# Iniciar con PM2
pm2 start pnpm --name "chatbot-grcp" -- start
pm2 save
pm2 startup
```

### Nginx como Reverse Proxy

```nginx
server {
    listen 80;
    server_name chat.grcp-arg.website;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔧 Variables de Entorno en Producción

Asegúrate de configurar estas variables:

```env
# Obligatoria
GOOGLE_GENERATIVE_AI_API_KEY=tu_api_key_aqui

# Opcionales
NEXT_PUBLIC_APP_URL=https://chat.grcp-arg.website
NODE_ENV=production
```

---

## 📊 Monitoreo y Logs

### Vercel
- Los logs están disponibles en el dashboard de Vercel
- Analytics integrados automáticamente

### Docker / VPS
```bash
# Ver logs en tiempo real
docker logs -f chatbot-grcp

# Con PM2
pm2 logs chatbot-grcp
```

---

## 🔒 Seguridad

### Recomendaciones:

1. **Nunca expongas tu API key**
   ```bash
   # En .gitignore
   .env*.local
   .env
   ```

2. **Rate Limiting** (Para evitar abuso)
   - El límite de 10 preguntas/día ya está implementado
   - Considera agregar rate limiting por IP en producción

3. **HTTPS**
   - Vercel lo proporciona automáticamente
   - Para servidores propios, usa Let's Encrypt:
     ```bash
     sudo certbot --nginx -d chat.grcp-arg.website
     ```

4. **Variables de entorno**
   - Nunca las incluyas en el código
   - Usa secretos de la plataforma

---

## 🎯 Dominio Personalizado

### Configurar en Vercel:

1. Ve a tu proyecto > Settings > Domains
2. Agrega: `chat.grcp-arg.website`
3. Configura los registros DNS en tu proveedor:
   ```
   Tipo: CNAME
   Nombre: chat
   Valor: cname.vercel-dns.com
   ```

### Configurar en servidor propio:

```
Tipo: A
Nombre: chat
Valor: [IP de tu servidor]
```

---

## 📈 Optimizaciones Post-Despliegue

1. **Activar Analytics**
   ```bash
   pnpm add @vercel/analytics
   ```

2. **Configurar caché**
   - Next.js ya optimiza automáticamente
   - Los assets estáticos se cachean por defecto

3. **Monitorear uso de API**
   - Revisa tu cuota de Google Gemini
   - Configura alertas si te acercas al límite

---

## 🆘 Solución de Problemas

### Error: "API key inválida"
```bash
# Verifica que la variable esté configurada
echo $GOOGLE_GENERATIVE_AI_API_KEY

# En producción, revisa los logs
vercel logs
```

### Error: Build falla
```bash
# Limpia caché y reinstala
rm -rf .next node_modules
pnpm install
pnpm build
```

### Error: Puerto en uso
```bash
# Cambia el puerto
PORT=3001 pnpm start
```

---

## 📞 Soporte

Si tienes problemas con el despliegue:

1. Revisa los logs de la plataforma
2. Verifica que todas las variables de entorno estén configuradas
3. Contacta al equipo de desarrollo

**Desarrollo y Soporte Técnico:**
- Julián Peruzzi
- Devanthos Agency

---

<div align="center">
  <strong>🚑 GRCP Argentina</strong>
  <br>
  <em>Rescate • Capacitación • Prevención</em>
</div>
