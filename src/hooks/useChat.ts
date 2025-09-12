import { useState, useCallback } from 'react';
import { ChatMessage, BriefingData, INITIAL_BRIEFING } from '../types';
import { QUESTIONS } from '../constants';
import { sendMessageToClaude, sendBriefingToMake } from '../services/api';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: QUESTIONS[0],
      timestamp: new Date()
    }
  ]);
  
  const [briefingData, setBriefingData] = useState<BriefingData>(INITIAL_BRIEFING);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [finalBriefing, setFinalBriefing] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);

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

  const handleGoToQuestion = useCallback((questionNumber: number) => {
    if (questionNumber < 1 || questionNumber > QUESTIONS.length) return;

    const newMessages: ChatMessage[] = [
      {
        id: `question-${questionNumber}`,
        role: 'assistant',
        content: QUESTIONS[questionNumber - 1],
        timestamp: new Date()
      }
    ];

    if (userAnswers[questionNumber - 1]) {
      newMessages.push({
        id: `user-answer-${questionNumber}`,
        role: 'user',
        content: userAnswers[questionNumber - 1],
        timestamp: new Date(),
      });
    }

    setMessages(newMessages);
    setCurrentStep(questionNumber);

  }, [userAnswers]);

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
    
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentStep - 1] = userMessage;
    setUserAnswers(newUserAnswers);

    if (isEditing) {
      setIsLoading(false);
      if (currentStep < QUESTIONS.length) {
        handleGoToQuestion(currentStep + 1);
      } else {
        // Last question in edit mode, regenerate briefing
        const allMessagesForBriefing = newUserAnswers.map((answer, index) => {
          return [
            { role: 'assistant', content: QUESTIONS[index] },
            { role: 'user', content: answer }
          ];
        }).flat();

        const aiResponse = await sendMessageToClaude(allMessagesForBriefing);
        setFinalBriefing(aiResponse);
        setIsEditing(false);
        setIsComplete(true);
      }
      return;
    }

    try {
      const allMessages = [...messages, userMsg];
      const aiResponse = await sendMessageToClaude(allMessages.map(msg => ({ role: msg.role, content: msg.content })));
      
      const isValidationMessage = aiResponse.toLowerCase().includes('necesito') || 
                                  aiResponse.toLowerCase().includes('podrías') ||
                                  aiResponse.toLowerCase().includes('específica');
      
      if (!isValidationMessage) {
        if (currentStep === 1) {
          const colors = extractColors(userMessage);
          const companyName = extractCompanyName(userMessage);
          updateBrandingColors(colors.primary, colors.secondary, companyName);
        }
        
        if (currentStep < QUESTIONS.length) {
          const nextQuestion = QUESTIONS[currentStep];
          const aiMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: nextQuestion,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiMsg]);
          setCurrentStep(prev => prev + 1);
        } else {
          setIsComplete(true);
          setFinalBriefing(aiResponse);
        }
      } else {
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMsg]);
      }
      
    } catch (error) {
      console.error('Error:', error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: 'Disculpa, hubo un error. ¿Podrías intentar de nuevo?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, currentStep, isLoading, updateBrandingColors, userAnswers, isEditing, handleGoToQuestion]);

  const startEditing = useCallback(() => {
    setIsEditing(true);
    setIsComplete(false);
    setFinalBriefing('');
    handleGoToQuestion(1);
  }, [handleGoToQuestion]);

  const editBriefing = useCallback(() => {
    startEditing();
  }, [startEditing]);

  const sendToProduction = useCallback(async () => {
    setIsLoading(true);
    try {
      const success = await sendBriefingToMake(briefingData, finalBriefing);
      if (!success) {
        throw new Error('Failed to send briefing');
      }
    } catch (error) {
      console.error('Error sending to production:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [briefingData, finalBriefing]);

  return {
    messages,
    sendMessage,
    briefingData,
    isLoading,
    isComplete,
    currentStep,
    finalBriefing,
    editBriefing,
    sendToProduction,
    isEditing,
    handleGoToQuestion,
    userAnswers
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