# ChatBot DevAnthos

Un chatbot moderno y elegante construido con Next.js 15, AI SDK, y Google Generative AI (Gemini 2.5 Flash).

## ✨ Características

-   **Streaming en tiempo real**: Respuestas que se muestran palabra por palabra
-   **UI moderna**: Interfaz elegante usando AI Elements y Tailwind CSS
-   **Soporte para archivos**: Sube y envía imágenes junto con tus mensajes
-   **Estados de carga**: Indicadores visuales para una mejor experiencia de usuario
-   **Manejo de errores**: Feedback claro cuando algo sale mal
-   **Responsive**: Funciona perfectamente en desktop y móvil
-   **Scroll automático**: Se desplaza automáticamente a los mensajes nuevos
-   **Botón de detener**: Cancela respuestas en progreso

## 🚀 Configuración

### 1. Instalar dependencias

```bash
pnpm install
# o
npm install
# o
yarn install
```

### 2. Configurar variables de entorno

Edita el archivo `.env.local` que ya está creado:

```bash
# Google Generative AI API Key
# Obtén tu API key desde: https://aistudio.google.com/app/apikey
GOOGLE_GENERATIVE_AI_API_KEY=tu_api_key_aqui
```

**Importante**: Reemplaza `tu_api_key_aqui` con tu API key real de Google AI Studio.

### 3. Ejecutar en modo desarrollo

```bash
pnpm dev
# o
npm run dev
# o
yarn dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🛠 Tecnologías utilizadas

-   **Framework**: Next.js 15 con App Router
-   **AI SDK**: @ai-sdk/react y @ai-sdk/google
-   **UI**: AI Elements + Tailwind CSS v4
-   **Modelo**: Google Gemini 2.5 Flash
-   **TypeScript**: Tipado completo
-   **Iconos**: Lucide React

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── api/chat/route.ts          # Endpoint de la API del chat
│   ├── layout.tsx                 # Layout principal
│   └── page.tsx                   # Página principal
├── components/
│   ├── ai-elements/               # Componentes de AI Elements
│   │   ├── conversation.tsx       # Componente de conversación
│   │   ├── message.tsx           # Componente de mensaje
│   │   └── prompt-input.tsx      # Componente de input
│   ├── interfaces/
│   │   └── Chatbot.tsx           # Componente principal del chatbot
│   └── ui/                       # Componentes de UI base
├── lib/
│   └── utils.ts                  # Utilidades
└── styles/
    └── globals.css               # Estilos globales
```

## 📝 Uso

1. **Escribir un mensaje**: Escribe tu pregunta en el campo de texto
2. **Enviar archivos**: Haz clic en el botón "+" para agregar imágenes
3. **Enviar**: Presiona Enter o haz clic en el botón de envío
4. **Ver la respuesta**: La respuesta aparecerá en tiempo real
5. **Detener**: Puedes detener una respuesta en progreso con el botón "Detener"

## 🐛 Solución de problemas

### Error: "GOOGLE_GENERATIVE_AI_API_KEY not found"

Asegúrate de que el archivo `.env.local` contiene tu API key válida.

### Error: "401 Unauthorized"

Verifica que tu API key de Google AI Studio es válida y tiene los permisos necesarios.

## 📧 Soporte

Si tienes problemas o preguntas, puedes:

-   Consultar la [documentación de AI SDK](https://ai-sdk.dev/docs)
-   Revisar la [documentación de Google AI](https://ai.google.dev/)

---

**¡Disfruta tu chatbot con IA! 🤖✨**
