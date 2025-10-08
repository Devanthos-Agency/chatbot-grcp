# 🚑 Chatbot GRCP Argentina# ChatBot DevAnthos



Asistente inteligente especializado en primeros auxilios, RCP y emergencias médicas para **GRCP Argentina** (Rescate • Capacitación • Prevención).Un chatbot moderno y elegante construido con Next.js 15, AI SDK, y Google Generative AI (Gemini 2.5 Flash).



![GRCP Argentina](https://i.pinimg.com/1200x/14/de/ee/14deee455a218bb8be843b5e70e21807.jpg)## ✨ Características



## 🎯 Características Principales-   **Streaming en tiempo real**: Respuestas que se muestran palabra por palabra

-   **UI moderna**: Interfaz elegante usando AI Elements y Tailwind CSS

### ✨ Asistente Especializado-   **Soporte para archivos**: Sube y envía imágenes junto con tus mensajes

- **Información de Emergencias**: Orientación sobre situaciones de emergencia médica-   **Estados de carga**: Indicadores visuales para una mejor experiencia de usuario

- **Capacitación**: Información sobre cursos de primeros auxilios y RCP-   **Manejo de errores**: Feedback claro cuando algo sale mal

- **Certificación Nacional**: Detalles sobre certificaciones válidas en Argentina-   **Responsive**: Funciona perfectamente en desktop y móvil

- **Recursos Educativos**: Acceso a herramientas gratuitas (mapa de DEAs, biblioteca, juegos)-   **Scroll automático**: Se desplaza automáticamente a los mensajes nuevos

- **Insumos Médicos**: Información sobre venta de DEAs, botiquines y equipamiento-   **Botón de detener**: Cancela respuestas en progreso



### 🔒 Sistema de Límites## 🚀 Configuración

- **Límite diario**: Máximo 10 preguntas por día por usuario

- **Almacenamiento local**: Utiliza localStorage para el control de uso### 1. Instalar dependencias

- **Reinicio automático**: El contador se resetea cada 24 horas

- **Indicadores visuales**: Muestra preguntas restantes en tiempo real```bash

pnpm install

### 🎨 Diseño UX/UI# o

- **Colores corporativos**: Esquema rojo/oscuro inspirado en [grcp-arg.website](https://grcp-arg.website/)npm install

- **Interfaz adaptable**: Diseño responsive para todos los dispositivos# o

- **Animaciones fluidas**: Transiciones suaves con Framer Motionyarn install

- **Modo oscuro**: Soporte completo para tema claro y oscuro```



### ⚕️ Características de Seguridad### 2. Configurar variables de entorno

- **Aviso legal obligatorio**: En todas las consultas médicas

- **Énfasis en emergencias**: Siempre recomienda llamar al 107Edita el archivo `.env.local` que ya está creado:

- **Información orientativa**: Aclara que NO sustituye atención médica profesional

- **Límite de responsabilidad**: Previene uso inadecuado de la información```bash

# Google Generative AI API Key

## 🚀 Tecnologías# Obtén tu API key desde: https://aistudio.google.com/app/apikey

GOOGLE_GENERATIVE_AI_API_KEY=tu_api_key_aqui

- **Framework**: [Next.js 15](https://nextjs.org/) con App Router```

- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)

- **Animaciones**: [Framer Motion](https://www.framer.com/motion/)**Importante**: Reemplaza `tu_api_key_aqui` con tu API key real de Google AI Studio.

- **IA**: [Vercel AI SDK](https://sdk.vercel.ai/) con Google Gemini 2.5 Flash

- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/)### 3. Ejecutar en modo desarrollo

- **TypeScript**: Tipado estático completo

- **Package Manager**: pnpm```bash

pnpm dev

## 📦 Instalación# o

npm run dev

```bash# o

# Clonar el repositorioyarn dev

git clone https://github.com/Devanthos-Agency/chatbot-grcp.git```



# Navegar al directorioAbre [http://localhost:3000](http://localhost:3000) en tu navegador.

cd chatbot-grcp

## 🛠 Tecnologías utilizadas

# Instalar dependencias

pnpm install-   **Framework**: Next.js 15 con App Router

-   **AI SDK**: @ai-sdk/react y @ai-sdk/google

# Configurar variables de entorno-   **UI**: AI Elements + Tailwind CSS v4

cp .env.example .env.local-   **Modelo**: Google Gemini 2.5 Flash

# Editar .env.local y agregar tu API key de Google Gemini-   **TypeScript**: Tipado completo

```-   **Iconos**: Lucide React



### 🔑 Variables de Entorno## 📁 Estructura del proyecto



Crea un archivo `.env.local` en la raíz del proyecto:```

src/

```env├── app/

GOOGLE_GENERATIVE_AI_API_KEY=tu_api_key_aqui│   ├── api/chat/route.ts          # Endpoint de la API del chat

```│   ├── layout.tsx                 # Layout principal

│   └── page.tsx                   # Página principal

Obtén tu API key en: [Google AI Studio](https://aistudio.google.com/app/apikey)├── components/

│   ├── ai-elements/               # Componentes de AI Elements

## 🏃‍♂️ Uso│   │   ├── conversation.tsx       # Componente de conversación

│   │   ├── message.tsx           # Componente de mensaje

```bash│   │   └── prompt-input.tsx      # Componente de input

# Modo desarrollo│   ├── interfaces/

pnpm dev│   │   └── Chatbot.tsx           # Componente principal del chatbot

│   └── ui/                       # Componentes de UI base

# Construir para producción├── lib/

pnpm build│   └── utils.ts                  # Utilidades

└── styles/

# Iniciar servidor de producción    └── globals.css               # Estilos globales

pnpm start```



# Linter## 📝 Uso

pnpm lint

```1. **Escribir un mensaje**: Escribe tu pregunta en el campo de texto

2. **Enviar archivos**: Haz clic en el botón "+" para agregar imágenes

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.3. **Enviar**: Presiona Enter o haz clic en el botón de envío

4. **Ver la respuesta**: La respuesta aparecerá en tiempo real

## 📂 Estructura del Proyecto5. **Detener**: Puedes detener una respuesta en progreso con el botón "Detener"



```## 🐛 Solución de problemas

chatbot-grcp/

├── src/### Error: "GOOGLE_GENERATIVE_AI_API_KEY not found"

│   ├── app/                    # App Router de Next.js

│   │   ├── api/chat/          # API endpoint para el chatAsegúrate de que el archivo `.env.local` contiene tu API key válida.

│   │   ├── layout.tsx         # Layout principal

│   │   └── page.tsx           # Página principal### Error: "401 Unauthorized"

│   ├── components/

│   │   ├── ai-elements/       # Componentes del chat (mensajes, respuestas)Verifica que tu API key de Google AI Studio es válida y tiene los permisos necesarios.

│   │   ├── animate-ui/        # Componentes animados

│   │   ├── interfaces/        # Chatbot principal## 📧 Soporte

│   │   └── ui/                # Componentes UI base

│   ├── hooks/Si tienes problemas o preguntas, puedes:

│   │   ├── use-daily-limit.tsx    # Hook para límite diario

│   │   └── use-controlled-state.tsx-   Consultar la [documentación de AI SDK](https://ai-sdk.dev/docs)

│   ├── lib/-   Revisar la [documentación de Google AI](https://ai.google.dev/)

│   │   ├── grcp-prompt.ts     # Prompt del sistema para GRCP

│   │   └── utils.ts           # Utilidades---

│   └── styles/

│       └── globals.css        # Estilos globales con tema GRCP**¡Disfruta tu chatbot con IA! 🤖✨**

├── public/                    # Assets estáticos
├── package.json
└── README.md
```

## 🎨 Personalización

### Modificar el Prompt del Sistema

Edita `src/lib/grcp-prompt.ts` para ajustar el comportamiento del asistente:

```typescript
export const GRCP_SYSTEM_PROMPT = `
Eres el asistente inteligente de GRCP Argentina...
`;
```

### Cambiar el Límite Diario

Modifica en `src/hooks/use-daily-limit.tsx`:

```typescript
const MAX_QUESTIONS_PER_DAY = 10; // Cambia el número aquí
```

### Ajustar Colores

Los colores principales están en `src/styles/globals.css`:

```css
:root {
    --primary: oklch(0.48 0.21 25); /* Rojo GRCP */
    /* ... más variables */
}
```

## 🔧 Configuración del Chatbot

El chatbot incluye un panel de configuración accesible desde el ícono de engranaje (⚙️) que permite:

- **Nombre del asistente**: Personalizar el nombre
- **Información adicional**: Contexto extra para el asistente
- **Propósito del chatbot**: Seleccionar entre:
  - 🚨 Información de Emergencias
  - ❤️ Capacitación en Primeros Auxilios
  - 🏢 Capacitación Empresarial
  - 👥 Educación Comunitaria
  - 💼 Insumos de Emergencia
  - 🌐 Consulta General

## 🌐 Integraciones

### GRCP Argentina
- **Web**: [https://grcp-arg.website/](https://grcp-arg.website/)
- **WhatsApp**: +54 9 2645 66-7981
- **Instagram**: [@grcp_arg](https://www.instagram.com/grcp_arg/)

### Dynamika (Aliado - Bienestar Laboral)
- **Web**: [https://dynamika2024.vercel.app/](https://dynamika2024.vercel.app/)
- **Email**: dynamika.bienestar@gmail.com
- **Teléfono**: +54 9 2645 66-7981

## 📱 Recursos de GRCP

El chatbot recomienda activamente estos recursos:

- **Aprende RCP**: Contenidos interactivos paso a paso
- **Mapa de DEAs**: Geolocalización de desfibriladores en Argentina
- **Biblioteca**: Recursos teóricos completos
- **Ritmo RCP**: Metrónomos y guías musicales
- **Juego RCP**: Aprendizaje lúdico del ritmo correcto
- **Galería**: Técnicas, equipos y situaciones
- **Realidad Aumentada**: Aprendizaje inmersivo

## ⚠️ Advertencias Importantes

Este chatbot:
- ✅ **SÍ** proporciona información orientativa sobre primeros auxilios
- ✅ **SÍ** recomienda recursos y capacitaciones
- ✅ **SÍ** ayuda a entender conceptos básicos
- ❌ **NO** sustituye atención médica profesional
- ❌ **NO** realiza diagnósticos médicos
- ❌ **NO** debe usarse como única fuente en emergencias reales

**En emergencias reales, SIEMPRE llama al 107** (emergencias médicas Argentina).

## 📄 Licencia

Este proyecto es propiedad de **GRCP Argentina** y **Devanthos Agency**.

## 👨‍💻 Desarrollo

Desarrollado por [Julián Peruzzi](https://www.linkedin.com/in/julianperuzzi/) para GRCP Argentina.

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: Amazing Feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📧 Contacto

**GRCP Argentina**
- WhatsApp: +54 9 2645 66-7981
- Instagram: [@grcp_arg](https://www.instagram.com/grcp_arg/)
- Web: [https://grcp-arg.website/](https://grcp-arg.website/)

**Desarrollo y Tecnología**
- Devanthos Agency
- Developer: Julián Peruzzi

---

<div align="center">
  <strong>🚑 Rescate • Capacitación • Prevención 🚑</strong>
  <br>
  <em>Porque saber salvar vidas, salva vidas</em>
</div>
