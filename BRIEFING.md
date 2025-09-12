# BRIEFING TÉCNICO SIMPLIFICADO (ACTUALIZADO)
## Sistema de Chat Conversacional para Briefings de Landing Pages

---

## 🎯 **OBJETIVO**
Crear una aplicación web simple que recopile información para briefings de landing pages mediante un chat conversacional con IA (Claude de Anthropic) y envíe los resultados a Make.com.

---

## 🛠️ **STACK TECNOLÓGICO**
- **Frontend:** React 18 + TypeScript
- **Estilos:** TailwindCSS
- **IA:** Anthropic Claude API
- **HTTP:** Axios
- **Animaciones:** Framer Motion (opcional)
- **Deploy:** Vercel/Netlify

---

## 🏗️ **ARQUITECTURA SIMPLE**

### **Estructura de Carpetas**
```
src/
├── components/
│   ├── Chat.tsx           // Componente principal del chat
│   ├── Message.tsx        // Burbuja de mensaje individual
│   ├── TypingIndicator.tsx // Indicador "escribiendo..."
│   └── BriefingPreview.tsx // Vista previa del briefing final
├── hooks/
│   └── useChat.ts         // Lógica principal del chat
├── services/
│   └── api.ts             // Llamadas a Claude API y webhook
├── types.ts               // Interfaces TypeScript
├── constants.ts           // Configuración y prompts
└── App.tsx               // Componente raíz
```

---

## 🔧 **ESPECIFICACIONES TÉCNICAS**

### **1. Interfaces TypeScript (types.ts)**
```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface BriefingData {
  // Branding
  companyName: string;
  logo: File | null;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  
  // Contenido del briefing
  valueProposition: string;
  problems: string[];
  solution: string;
  testimonials: string;
  offer: string;
  cta: string;
}

// Configuración de branding por defecto
const DEFAULT_BRANDING = {
  companyName: '',
  logo: null,
  primaryColor: '#3B82F6',
  secondaryColor: '#1E40AF',
  fontFamily: 'sans-serif'
};
```

### **2. Hook Principal (useChat.ts)**
```typescript
const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [briefingData, setBriefingData] = useState<BriefingData>({
    ...DEFAULT_BRANDING,
    valueProposition: '',
    problems: [],
    solution: '',
    testimonials: '',
    offer: '',
    cta: ''
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const sendMessage = async (userMessage: string) => {
    // Lógica de envío y procesamiento
  };
  
  return { 
    messages, 
    sendMessage, 
    briefingData, 
    isComplete, 
    isLoading 
  };
};
```

### **3. Prompt del Sistema Actualizado**
```typescript
const SYSTEM_PROMPT = `
Eres un copywriter experto especializado en landing pages. Tu trabajo es hacer exactamente 8 preguntas para crear un briefing completo:

1. BRANDING: Nombre de la empresa y colores de marca preferidos
2. IDENTIDAD: Qué hace la empresa exactamente
3. PROPUESTA DE VALOR: Qué promesa específica y medible ofreces
4. PROBLEMAS: Qué 3 problemas principales resuelves
5. SOLUCIÓN: Cómo resuelves esos problemas (método/sistema)
6. PRUEBA SOCIAL: Testimonios o casos de éxito que tengas
7. OFERTA: Qué incluye tu producto/servicio y precio
8. LLAMADA A ACCIÓN: Qué acción quieres que tome el cliente

HAZ UNA PREGUNTA A LA VEZ. Sé conversacional y amigable.
Para la pregunta de branding, pregunta sobre colores preferidos (por defecto usar #3B82F6 y #1E40AF si no especifican).
Después de la pregunta 8, genera un briefing final en formato markdown.
`;
```

---

## 🎨 **ESPECIFICACIONES DE DISEÑO**

### **Sistema de Colores (Actualizado)**
```typescript
// Colores por defecto del sistema
const DESIGN_SYSTEM = {
  // Colores base de la app
  primary: '#3B82F6',     // blue-500
  secondary: '#1E40AF',   // blue-700
  
  // Colores dinámicos del cliente (actualizables)
  clientPrimary: briefingData.primaryColor,
  clientSecondary: briefingData.secondaryColor,
  
  // Colores fijos de la interfaz
  background: '#F9FAFB',  // gray-50
  chatUser: '#3B82F6',    // blue-500
  chatAI: '#FFFFFF',      // white
  border: '#E5E7EB',      // gray-200
  text: '#111827'         // gray-900
};
```

### **TailwindCSS con Variables CSS**
```css
/* globals.css */
:root {
  --color-client-primary: #3B82F6;
  --color-client-secondary: #1E40AF;
  --font-client: 'Inter', sans-serif;
}

/* Clases dinámicas */
.client-primary {
  background-color: var(--color-client-primary);
}

.client-secondary {
  background-color: var(--color-client-secondary);
}

.client-font {
  font-family: var(--font-client);
}
```

### **Layout Responsive**
```css
/* Mobile: Stack vertical, chat ocupa pantalla completa */
/* Desktop: Chat centrado, máximo 800px de ancho */
/* Header: Muestra nombre de empresa y colores de marca */
/* Preview: Usa los colores y fuente del cliente */
```

---

## 📱 **COMPONENTES ACTUALIZADOS**

### **1. Chat.tsx - Con Branding Dinámico**
```typescript
const Chat = () => {
  const { briefingData } = useChat();
  
  // Actualizar CSS variables cuando cambie el branding
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--color-client-primary', 
      briefingData.primaryColor
    );
    document.documentElement.style.setProperty(
      '--color-client-secondary', 
      briefingData.secondaryColor
    );
    document.documentElement.style.setProperty(
      '--font-client', 
      briefingData.fontFamily
    );
  }, [briefingData.primaryColor, briefingData.secondaryColor, briefingData.fontFamily]);

  return (
    <div className="h-screen bg-gray-50">
      {/* Header con branding */}
      <header className="client-primary text-white p-4">
        <h1 className="client-font text-xl font-bold">
          {briefingData.companyName || 'Briefing Generator'}
        </h1>
      </header>
      
      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Mensajes */}
      </div>
    </div>
  );
};
```

### **2. BriefingPreview.tsx - Vista con Branding**
```typescript
const BriefingPreview = ({ briefingData }: { briefingData: BriefingData }) => {
  return (
    <div 
      className="max-w-4xl mx-auto p-6 client-font"
      style={{ 
        borderTop: `4px solid ${briefingData.primaryColor}` 
      }}
    >
      <header className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: briefingData.primaryColor }}>
          BRIEFING PARA LANDING PAGE
        </h1>
        <p className="text-gray-600 mt-2">
          {briefingData.companyName} - {new Date().toLocaleDateString()}
        </p>
      </header>

      <section className="mb-6">
        <h2 
          className="text-xl font-semibold mb-3"
          style={{ color: briefingData.secondaryColor }}
        >
          1. BRANDING
        </h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p><strong>Empresa:</strong> {briefingData.companyName}</p>
          <p><strong>Color Primario:</strong> 
            <span 
              className="inline-block w-6 h-6 rounded ml-2 mr-1"
              style={{ backgroundColor: briefingData.primaryColor }}
            ></span>
            {briefingData.primaryColor}
          </p>
          <p><strong>Color Secundario:</strong>
            <span 
              className="inline-block w-6 h-6 rounded ml-2 mr-1"
              style={{ backgroundColor: briefingData.secondaryColor }}
            ></span>
            {briefingData.secondaryColor}
          </p>
          <p><strong>Fuente:</strong> {briefingData.fontFamily}</p>
        </div>
      </section>

      {/* Resto de secciones... */}
    </div>
  );
};
```

---

## 📋 **PAYLOAD ACTUALIZADO PARA MAKE.COM**
```json
{
  "timestamp": "2025-09-11T12:00:00Z",
  "status": "completed",
  "briefing": {
    "branding": {
      "company_name": "string",
      "logo_url": "string | null",
      "primary_color": "#3B82F6",
      "secondary_color": "#1E40AF",
      "font_family": "sans-serif"
    },
    "content": {
      "value_proposition": "string",
      "problems": ["string", "string", "string"],
      "solution": "string",
      "testimonials": "string",
      "offer": "string",
      "cta": "string"
    },
    "full_briefing_markdown": "string"
  }
}
```

---

## 🎯 **FUNCIONALIDADES DE BRANDING**

### **1. Personalización Dinámica**
- Los colores del cliente se aplican en tiempo real
- La fuente se actualiza automáticamente
- El preview muestra exactamente como se verá

### **2. Colores por Defecto**
- Si el cliente no especifica colores, usa `#3B82F6` y `#1E40AF`
- Sistema fallback robusto

### **3. Upload de Logo (Opcional)**
- Input para subir logo
- Preview inmediato
- Envío a Make.com como URL base64

---

## ✅ **RESULTADO FINAL ACTUALIZADO**
Una aplicación que:
1. **Recopila branding** - Colores, fuente, logo
2. **Se personaliza** - UI cambia según branding del cliente
3. **Genera briefing** - Con identidad visual incluida
4. **Envía todo** - Branding + contenido a Make.com