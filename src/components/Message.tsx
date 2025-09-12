import { ChatMessage } from '../types';

interface MessageProps {
  message: ChatMessage;
}

export const Message = ({ message }: MessageProps) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isUser
            ? 'client-primary text-white'
            : 'bg-white border border-gray-200 text-gray-900'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <span className="text-xs opacity-70 block mt-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};