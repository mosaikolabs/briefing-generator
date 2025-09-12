import React, { useState } from 'react';
import { Edit3, Send, Check, AlertCircle } from 'lucide-react';

interface BriefingFinalProps {
  briefingContent: string;
  onEdit: () => void;
  onSendToProduction: () => void;
  isLoading?: boolean;
}

export const BriefingFinal: React.FC<BriefingFinalProps> = ({ 
  briefingContent, 
  onEdit, 
  onSendToProduction,
  isLoading = false 
}) => {
  const [isAgreed, setIsAgreed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSendToProduction = async () => {
    if (!isAgreed) {
      alert('Debes aceptar la declaración antes de enviar a producción.');
      return;
    }
    
    await onSendToProduction();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Briefing Content */}
      <div className="mb-8">
        <div className="prose max-w-none bg-gray-50 p-6 rounded-lg border">
          <div 
            className="whitespace-pre-wrap text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatBriefingForDisplay(briefingContent) }}
          />
        </div>
      </div>

      {/* Legal Declaration */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="declaration"
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="declaration" className="text-sm text-gray-700 leading-relaxed">
            <span className="font-semibold">Declaración de Responsabilidad:</span>
            <br />
            Declaro que este briefing refleja fielmente mi pedido en su integralidad y reconozco que la landing page será generada a partir de la información proporcionada. Es mi responsabilidad responder atentamente para que el resultado sea exacto según mis necesidades. Entiendo que la calidad del resultado final depende directamente de la precisión y completitud de mis respuestas.
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Edit Button */}
        <button
          onClick={onEdit}
          disabled={isLoading}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
        >
          <Edit3 size={18} />
          <span>Editar Briefing</span>
        </button>

        {/* Send to Production Button */}
        <button
          onClick={handleSendToProduction}
          disabled={!isAgreed || isLoading}
          className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            isAgreed 
              ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <Send size={18} />
          )}
          <span>
            {isLoading ? 'Enviando...' : 'Enviar a Producción'}
          </span>
        </button>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
          <Check size={20} className="text-green-600" />
          <div>
            <p className="font-semibold text-green-800">¡Briefing Enviado con Éxito!</p>
            <p className="text-sm text-green-600">
              Tu briefing ha sido enviado a producción. Recibirás una confirmación por email en breve.
            </p>
          </div>
        </div>
      )}

      {/* Info Note */}
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start space-x-3">
        <AlertCircle size={20} className="text-amber-600 mt-0.5" />
        <div className="text-sm text-amber-700">
          <p className="font-semibold mb-1">Información Importante:</p>
          <p>
            Una vez enviado a producción, el briefing será procesado por nuestro equipo de desarrollo. 
            Si necesitas hacer cambios después del envío, por favor contacta a soporte.
          </p>
        </div>
      </div>
    </div>
  );
};

// Helper function to format briefing content for better display
const formatBriefingForDisplay = (content: string): string => {
  return content
    .replace(/# /g, '<h1 class="text-2xl font-bold mb-4 text-gray-800">')
    .replace(/## /g, '<h2 class="text-xl font-semibold mb-3 mt-6 text-gray-700">')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-800">$1</strong>')
    .replace(/- /g, '• ')
    .replace(/\n/g, '<br>')
    .replace(/---/g, '<hr class="my-4 border-gray-300">')
    .replace(/<h1 class="text-2xl font-bold mb-4 text-gray-800">/g, '<h1 class="text-2xl font-bold mb-4 text-gray-800">')
    .replace(/<h2 class="text-xl font-semibold mb-3 mt-6 text-gray-700">/g, '<h2 class="text-xl font-semibold mb-3 mt-6 text-gray-700">');
};