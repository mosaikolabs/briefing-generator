import axios from 'axios';
import { BriefingData } from '../types';
import { SYSTEM_PROMPT } from '../constants';

const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;
const MAKE_WEBHOOK_URL = import.meta.env.VITE_MAKE_WEBHOOK_URL;
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

export const sendMessageToClaude = async (messages: Array<{role: string, content: string}>): Promise<string> => {
  // Si no hay API key, usar fallback inteligente
  if (!CLAUDE_API_KEY) {
    return await smartFallback(messages);
  }

  try {
    const response = await axios.post(
      CLAUDE_API_URL,
      {
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: messages.map(msg => ({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content
        }))
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    return response.data.content[0].text;
  } catch (error) {
    console.error('Error calling Claude API:', error);
    return await smartFallback(messages);
  }
};

// Fallback inteligente que simula validación de Claude
const smartFallback = async (messages: Array<{role: string, content: string}>): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
  
  const userMessages = messages.filter(msg => msg.role === 'user');
  const lastUserMessage = userMessages[userMessages.length - 1]?.content?.toLowerCase() || '';
  const currentStep = userMessages.length;

  // Validar si la respuesta es muy corta o irrelevante (incluye el primer paso)
  if (currentStep >= 1 && (lastUserMessage.length < 3 || isIrrelevantResponse(lastUserMessage, currentStep - 1))) {
    return getValidationMessage(currentStep - 1);
  }

  const questions = [
    "Perfecto! Ahora cuéntame, ¿qué hace exactamente tu empresa? ¿A qué se dedica?",
    "Excelente! Necesito saber: ¿Qué promesa específica y medible le ofreces a tus clientes? ¿Cuál es tu propuesta de valor única?",
    "Muy bien! Dime, ¿cuáles son los 3 problemas principales que resuelve tu producto o servicio para tus clientes?",
    "Perfecto! Ahora explícame: ¿Cómo resuelves específicamente esos problemas? ¿Cuál es tu método o sistema?",
    "¡Genial! ¿Tienes testimonios, casos de éxito o pruebas sociales que puedas compartir conmigo?",
    "Excelente! Cuéntame sobre tu oferta: ¿Qué incluye exactamente tu producto/servicio y cuál es el precio?",
    "¡Casi terminamos! ¿Qué acción específica quieres que tomen tus clientes? ¿Cuál es tu llamada a la acción principal?",
    generateFinalBriefing(messages)
  ];
  
  const questionIndex = Math.min(currentStep - 1, questions.length - 1);
  return questions[questionIndex];
};

const isIrrelevantResponse = (response: string, step: number): boolean => {
  const irrelevantWords = ['hola', 'hi', 'hello', 'ok', 'si', 'no', 'bien', 'gracias', 'bueno', 'perfecto'];
  const words = response.split(' ').filter(word => word.length > 0);
  
  // Si solo tiene 1-3 palabras muy básicas, siempre es irrelevante
  if (words.length <= 3 && words.every(word => irrelevantWords.includes(word.toLowerCase()))) {
    return true;
  }
  
  // Para respuestas muy cortas (menos de 5 caracteres), validar más estrictamente
  if (response.length <= 5) {
    return true;
  }
  
  // Respuestas que no corresponden al tema según el paso
  const stepKeywords = [
    ['empresa', 'compañía', 'negocio', 'marca', 'color', 'nombre', 'llama', 'somos'], // Paso 0: Branding
    ['hace', 'dedica', 'servicio', 'producto', 'ofrece', 'vende'], // Paso 1: Identidad
    ['promesa', 'valor', 'ofrece', 'beneficio', 'única', 'diferente'], // Paso 2: Propuesta valor
    ['problema', 'dificultad', 'resuelve', 'soluciona', 'ayuda'], // Paso 3: Problemas
    ['solución', 'método', 'sistema', 'como', 'proceso', 'manera'], // Paso 4: Solución
    ['testimonio', 'caso', 'prueba', 'cliente', 'éxito', 'resultado'], // Paso 5: Prueba social
    ['oferta', 'precio', 'incluye', 'producto', 'cuesta', 'vale'], // Paso 6: Oferta
    ['acción', 'llamada', 'cliente', 'hacer', 'contacto', 'comprar'] // Paso 7: CTA
  ];
  
  if (step < stepKeywords.length) {
    const hasRelevantKeywords = stepKeywords[step].some(keyword => 
      response.toLowerCase().includes(keyword)
    );
    return !hasRelevantKeywords && response.length < 15;
  }
  
  return false;
};

const getValidationMessage = (step: number): string => {
  const validationMessages = [
    "Para crear un briefing completo necesito el nombre de tu empresa y tus colores de marca. ¿Podrías darme esa información?",
    "Necesito saber específicamente qué hace tu empresa para poder crear el briefing correcto. ¿Podrías contarme más detalles?",
    "Para el briefing necesito conocer tu propuesta de valor única. ¿Qué promesa específica le haces a tus clientes?",
    "Es importante conocer los problemas que resuelves. ¿Puedes mencionarme los 3 principales problemas de tus clientes?",
    "Para el briefing necesito entender cómo resuelves esos problemas. ¿Cuál es tu método o proceso?",
    "¿Tienes algún testimonio o caso de éxito que puedas compartir? Esto es importante para el briefing.",
    "Necesito conocer tu oferta específica y el precio. ¿Qué incluye exactamente tu producto o servicio?",
    "¿Cuál es la acción principal que quieres que tomen tus clientes? ¿Llamarte, comprar, registrarse?"
  ];
  
  return validationMessages[step] || "¿Podrías darme una respuesta más específica para continuar con el briefing?";
};

const generateFinalBriefing = (messages: Array<{role: string, content: string}>): string => {
  const userMessages = messages.filter(msg => msg.role === 'user');
  
  return `# 🎯 BRIEFING PARA LANDING PAGE - COMPLETADO

## 1. BRANDING
- **Empresa:** ${extractCompanyName(userMessages[0]?.content || '')}
- **Colores:** ${extractColors(userMessages[0]?.content || '')}

## 2. IDENTIDAD DE LA EMPRESA
${userMessages[1]?.content || 'Información por completar'}

## 3. PROPUESTA DE VALOR
${userMessages[2]?.content || 'Información por completar'}

## 4. PROBLEMAS QUE RESUELVE
${formatProblems(userMessages[3]?.content || '')}

## 5. SOLUCIÓN
${userMessages[4]?.content || 'Información por completar'}

## 6. PRUEBA SOCIAL
${userMessages[5]?.content || 'Información por completar'}

## 7. OFERTA
${userMessages[6]?.content || 'Información por completar'}

## 8. LLAMADA A ACCIÓN
${userMessages[7]?.content || 'Información por completar'}

---
¡Briefing completado! Toda la información ha sido recopilada para crear tu landing page profesional.`;
};

const extractCompanyName = (text: string): string => {
  // Lógica simple para extraer nombre de empresa
  const words = text.split(' ');
  return words.slice(0, 3).join(' ') || 'Empresa';
};

const extractColors = (text: string): string => {
  const hexRegex = /#[0-9A-Fa-f]{6}/g;
  const colors = text.match(hexRegex);
  if (colors && colors.length >= 2) {
    return `${colors[0]} (primario), ${colors[1]} (secundario)`;
  }
  return '#3B82F6 (primario), #1E40AF (secundario)';
};

const formatProblems = (text: string): string => {
  if (text.includes('1.') || text.includes('-')) {
    return text;
  }
  const sentences = text.split('.').filter(s => s.trim().length > 0);
  return sentences.slice(0, 3).map((s, i) => `${i + 1}. ${s.trim()}`).join('\n');
};

export const sendBriefingToMake = async (briefingData: BriefingData, fullBriefing: string): Promise<boolean> => {
  if (!MAKE_WEBHOOK_URL) {
    console.log('MAKE_WEBHOOK_URL not configured, skipping webhook');
    return true;
  }

  try {
    const payload = {
      timestamp: new Date().toISOString(),
      status: 'completed',
      briefing: {
        branding: {
          company_name: briefingData.companyName,
          primary_color: briefingData.primaryColor,
          secondary_color: briefingData.secondaryColor
        },
        content: {
          value_proposition: briefingData.valueProposition,
          problems: briefingData.problems,
          solution: briefingData.solution,
          testimonials: briefingData.testimonials,
          offer: briefingData.offer,
          cta: briefingData.cta
        },
        full_briefing_markdown: fullBriefing
      }
    };

    await axios.post(MAKE_WEBHOOK_URL, payload);
    return true;
  } catch (error) {
    console.error('Error sending to Make.com:', error);
    return false;
  }
};