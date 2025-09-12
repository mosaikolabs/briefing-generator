import axios from 'axios';
import { BriefingData } from '../types';

// const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;
const MAKE_WEBHOOK_URL = import.meta.env.VITE_MAKE_WEBHOOK_URL;

// Simulador de preguntas para demo (en producción usarías un backend)
const QUESTIONS = [
  "Perfecto! Ahora cuéntame, ¿qué hace exactamente tu empresa? ¿A qué se dedica?",
  "Excelente! Ahora necesito saber: ¿Qué promesa específica y medible le ofreces a tus clientes? ¿Cuál es tu propuesta de valor única?",
  "Muy bien! Dime, ¿cuáles son los 3 problemas principales que resuelve tu producto o servicio para tus clientes?",
  "Perfecto! Ahora explícame: ¿Cómo resuelves específicamente esos problemas? ¿Cuál es tu método o sistema?",
  "¡Genial! ¿Tienes testimonios, casos de éxito o pruebas sociales que puedas compartir conmigo?",
  "Excelente! Ahora cuéntame sobre tu oferta: ¿Qué incluye exactamente tu producto/servicio y cuál es el precio?",
  "¡Casi terminamos! ¿Qué acción específica quieres que tomen tus clientes? ¿Cuál es tu llamada a la acción principal?",
  `# 🎯 BRIEFING PARA LANDING PAGE - COMPLETADO

## 1. BRANDING
- **Empresa:** [Nombre de la empresa]
- **Colores:** Primario y secundario configurados

## 2. PROPUESTA DE VALOR
[Información recopilada durante el chat]

## 3. PROBLEMAS QUE RESUELVE
- Problema 1
- Problema 2  
- Problema 3

## 4. SOLUCIÓN
[Método o sistema explicado]

## 5. PRUEBA SOCIAL
[Testimonios y casos de éxito]

## 6. OFERTA
[Detalles del producto/servicio y precio]

## 7. LLAMADA A ACCIÓN
[Acción específica que debe tomar el cliente]

---
¡Briefing completado! Toda la información ha sido recopilada para crear tu landing page.`
];

export const sendMessageToClaude = async (messages: Array<{role: string, content: string}>): Promise<string> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  // Contar mensajes del usuario para determinar qué pregunta hacer
  const userMessages = messages.filter(msg => msg.role === 'user');
  const questionIndex = userMessages.length - 1;
  
  if (questionIndex < QUESTIONS.length) {
    return QUESTIONS[questionIndex];
  }
  
  return "¡Gracias por completar el briefing!";
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