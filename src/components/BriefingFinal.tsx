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
    <div className="container-max section-padding">
      {/* Header */}
      <div className="text-center mb-12 animate-fadeInUp">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-full px-6 py-3 mb-6 shadow-lg">
          <div className="w-3 h-3 bg-white rounded-full animate-pulseGlow"></div>
          <span className="font-bold">Briefing Completado</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
          Tu Briefing está{' '}
          <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Listo
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
          Revisa toda la información recopilada y decide si quieres editarla o enviarla directamente a producción.
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Briefing Content */}
        <div className="mb-12 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100/80">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-gray-900 mb-4 flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                Briefing Completo
              </h2>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-white/50 p-8 rounded-2xl border border-gray-100/80">
              <div 
                className="whitespace-pre-wrap text-base leading-relaxed text-gray-700"
                dangerouslySetInnerHTML={{ __html: formatBriefingForDisplay(briefingContent) }}
              />
            </div>
          </div>
        </div>

        {/* Legal Declaration */}
        <div className="mb-8 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-100/80">
            <label htmlFor="declaration" className="flex items-start space-x-6 cursor-pointer">
              <div className="flex-shrink-0 mt-1">
                <input
                  type="checkbox"
                  id="declaration"
                  checked={isAgreed}
                  onChange={(e) => setIsAgreed(e.target.checked)}
                  className="w-6 h-6 text-primary-600 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 border-2 border-gray-300 rounded-md transition-all duration-200"
                />
              </div>
              <div className="text-base text-gray-700 leading-relaxed">
                <span className="font-black text-gray-900 text-lg block mb-2">Declaración de Responsabilidad</span>
                <p className="text-gray-600 text-sm">
                  Declaro que este briefing refleja fielmente mi pedido en su integralidad y reconozco que la landing page será generada a partir de la información proporcionada. Es mi responsabilidad responder atentamente para que el resultado sea exacto según mis necesidades. Entiendo que la calidad del resultado final depende directamente de la precisión y completitud de mis respuestas.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
          {/* Edit Button */}
          <button
            onClick={onEdit}
            disabled={isLoading}
            className="flex items-center justify-center space-x-3 px-8 py-4 bg-white/60 backdrop-blur-sm border-2 border-gray-200/80 text-gray-800 rounded-2xl hover:border-primary-500/50 hover:text-primary-600 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg"
          >
            <Edit3 size={22} />
            <span>Editar Briefing</span>
          </button>

          {/* Send to Production Button */}
          <button
            onClick={handleSendToProduction}
            disabled={!isAgreed || isLoading}
            className={`flex flex-1 items-center justify-center space-x-3 px-8 py-4 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg transform hover:-translate-y-1 ${
              isAgreed 
                ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white hover:shadow-2xl animate-pulseGlow' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white"></div>
            ) : (
              <Send size={22} />
            )}
            <span className="ml-2">
              {isLoading ? 'Enviando a Producción...' : 'Enviar a Producción'}
            </span>
          </button>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mt-8 animate-fadeInUp">
            <div className="bg-green-50 border-2 border-green-200/60 rounded-3xl p-8 flex items-center space-x-6">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Check size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-green-800 mb-1">¡Briefing Enviado con Éxito!</h3>
                <p className="text-green-700 leading-relaxed">
                  Tu briefing ha sido enviado a producción. Recibirás una confirmación por email en breve.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info Note */}
        <div className="mt-8 animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
          <div className="bg-amber-50 border-2 border-amber-200/60 rounded-3xl p-8 flex items-start space-x-6">
            <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
              <AlertCircle size={32} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-amber-800 mb-2">Información Importante</h3>
              <p className="text-amber-800 leading-relaxed text-sm">
                Una vez enviado a producción, el briefing será procesado por nuestro equipo de desarrollo. 
                Si necesitas hacer cambios después del envío, por favor contacta a soporte lo antes posible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format briefing content for better display
const formatBriefingForDisplay = (content: string): string => {
  // Process markdown-like syntax into styled HTML with Tailwind classes
  const lines = content.split('\n');
  let html = '';
  let inList = false;

  lines.forEach(line => {
    if (line.startsWith('# ')) {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      html += `<h1 class="text-3xl font-black text-gray-900 mb-4 mt-6">${line.substring(2)}</h1>`;
    } else if (line.startsWith('## ')) {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      html += `<h2 class="text-2xl font-bold text-gray-800 mb-3 mt-5">${line.substring(3)}</h2>`;
    } else if (line.startsWith('- ')) {
      if (!inList) {
        html += '<ul class="list-disc list-inside space-y-2 mb-4">';
        inList = true;
      }
      html += `<li class="text-gray-700 leading-relaxed">${line.substring(2)}</li>`;
    } else if (line.trim() === '---') {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      html += '<hr class="my-6 border-gray-200">';
    } else if (line.trim() === '') {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      html += '<br>';
    } else {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      // Replace **text** with <strong>
      const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-800">$1</strong>');
      html += `<p class="text-gray-700 leading-relaxed">${formattedLine}</p>`;
    }
  });

  if (inList) {
    html += '</ul>';
  }

  return html;
};
