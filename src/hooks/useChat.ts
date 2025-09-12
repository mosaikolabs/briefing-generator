import { useState, useCallback } from 'react';
import { ChatMessage, BriefingData, INITIAL_BRIEFING } from '../types';
import { WELCOME_MESSAGE, SYSTEM_PROMPT } from '../constants';
import { sendMessageToClaude, sendBriefingToMake } from '../services/api';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: WELCOME_MESSAGE,
      timestamp: new Date()
    }
  ]);
  
  const [briefingData, setBriefingData] = useState<BriefingData>(INITIAL_BRIEFING);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const updateBrandingColors = useCallback((primary: string, secondary: string, company: string) => {
    document.documentElement.style.setProperty('--color-client-primary', primary);
    document.documentElement.style.setProperty('--color-client-secondary', secondary);
    
    setBriefingData(prev => ({
      ...prev,
      primaryColor: primary,
      secondaryColor: secondary,
      companyName: company
    }));
  }, []);

  const sendMessage = useCallback(async (userMessage: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    
    // Extraer información del primer mensaje (empresa y colores)
    if (currentStep === 1) {
      const colors = extractColors(userMessage);
      const companyName = extractCompanyName(userMessage);
      updateBrandingColors(colors.primary, colors.secondary, companyName);
    }
    
    try {
      const allMessages = [...messages, userMsg];
      const aiResponse = await sendMessageToClaude(allMessages.map(msg => ({ role: msg.role, content: msg.content })));
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMsg]);
      
      // Avanzar al siguiente paso
      if (currentStep < 8) {
        setCurrentStep(prev => prev + 1);
      } else {
        setIsComplete(true);
        await sendBriefingToMake(briefingData, aiResponse);
      }
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [messages, briefingData, currentStep, isLoading, updateBrandingColors]);

  return {
    messages,
    sendMessage,
    briefingData,
    isLoading,
    isComplete,
    currentStep
  };
};

const extractColors = (message: string): { primary: string; secondary: string } => {
  const hexRegex = /#[0-9A-Fa-f]{6}/g;
  const colors = message.match(hexRegex);
  
  return {
    primary: colors?.[0] || '#3B82F6',
    secondary: colors?.[1] || '#1E40AF'
  };
};

const extractCompanyName = (message: string): string => {
  const words = message.split(' ');
  const companyIndex = words.findIndex(word => 
    word.toLowerCase().includes('empresa') || 
    word.toLowerCase().includes('compañía') ||
    word.toLowerCase().includes('negocio')
  );
  
  if (companyIndex !== -1 && companyIndex < words.length - 1) {
    return words.slice(companyIndex + 1, companyIndex + 3).join(' ');
  }
  
  return words.slice(0, 2).join(' ');
};