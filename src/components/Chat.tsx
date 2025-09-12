import { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import { Message } from './Message';
import { TypingIndicator } from './TypingIndicator';
import { BriefingFinal } from './BriefingFinal';

export const Chat = () => {
  const { messages, sendMessage, briefingData, isLoading, isComplete, currentStep, finalBriefing, editBriefing, sendToProduction } = useChat();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading && !isComplete) {
      sendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  // Si está completo, mostrar la interfaz final
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
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="client-primary text-white p-4 shadow-sm">
        <h1 className="text-xl font-bold">
          {briefingData.companyName || 'WebCraft AI'}
        </h1>
        <p className="text-sm opacity-90">
          Pregunta {currentStep}/8
        </p>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="max-w-2xl mx-auto">
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escribe tu respuesta..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="client-primary text-white px-6 py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};