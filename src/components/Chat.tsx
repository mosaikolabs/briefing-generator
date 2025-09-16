import { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import { Message } from './Message';
import { TypingIndicator } from './TypingIndicator';
import { BriefingFinal } from './BriefingFinal';
import { QUESTIONS } from '../constants';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Chat = () => {
  const { 
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
  } = useChat();
  
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (isEditing && userAnswers[currentStep - 1]) {
      setInputValue(userAnswers[currentStep - 1]);
    } else {
      setInputValue('');
    }
  }, [isEditing, currentStep, userAnswers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading && !isComplete) {
      sendMessage(inputValue.trim());
      if (!isEditing) {
        setInputValue('');
      }
    }
  };

  if (isComplete && finalBriefing) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <BriefingFinal
          briefingContent={finalBriefing}
          onEdit={editBriefing}
          onSendToProduction={sendToProduction}
          isLoading={isLoading}
        />
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col">
      <header className="webcraft-gradient-bg text-white p-6 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-2xl font-black text-white mb-1 animate-fadeInUp">
            {briefingData.companyName || 'WebCraft AI'}
          </h1>
          <p className="text-primary-100 opacity-90 font-medium">
            {isEditing ? 'Editando Briefing' : currentStep === 0 ? 'Presentación • Chat de Briefing' : `Pregunta ${currentStep}/${QUESTIONS.length} • Chat de Briefing`}
          </p>
        </div>
      </header>

      {isEditing && (
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/80 py-2 px-4 shadow-sm">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <button 
              onClick={() => handleGoToQuestion(currentStep - 1)}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={20} />
              <span className="font-bold">Anterior</span>
            </button>
            <div className="text-sm font-bold text-gray-700">
              Pregunta {currentStep} de {QUESTIONS.length}
            </div>
            <button 
              onClick={() => handleGoToQuestion(currentStep + 1)}
              disabled={currentStep === QUESTIONS.length}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 disabled:opacity-50 transition-colors"
            >
              <span className="font-bold">Siguiente</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="max-w-2xl mx-auto">
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-6 bg-white border-t border-gray-200 shadow-lg">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isEditing ? 'Edita tu respuesta...' : 'Escribe tu respuesta...'}
              className="flex-1 px-6 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 text-lg font-medium placeholder-gray-400 shadow-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-4 rounded-2xl hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:transform-none font-bold text-lg animate-pulseGlow w-full md:w-auto"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>{isEditing ? 'Actualizando...' : 'Enviando...'}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span>{isEditing ? (currentStep === QUESTIONS.length ? 'Finalizar Edición' : 'Actualizar') : 'Enviar'}</span>
                  <svg className="inline-block ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};