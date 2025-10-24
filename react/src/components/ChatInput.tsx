import React, { useState, useRef, useCallback } from 'react';

interface ChatInputProps {
  onSend: (content: string, images?: string[]) => void;
  onTyping: (isTyping: boolean) => void;
  disabled?: boolean;
  theme?: 'light' | 'dark';
  customStyles?: any;
  accentColor?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSend, 
  onTyping, 
  disabled,
  theme = 'dark',
  customStyles,
  accentColor = '#8B5CF6',
}) => {
  const [message, setMessage] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const isTypingRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Only send typing=true if we haven't already
    if (!isTypingRef.current) {
      onTyping(true);
      isTypingRef.current = true;
    }
    
    // Clear any existing timeout and set a new one
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Send typing=false after 1.5 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false);
      isTypingRef.current = false;
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() || images.length > 0) {
      // Clear typing timeout and send typing=false
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      onTyping(false);
      isTypingRef.current = false;
      
      onSend(message.trim(), images.length > 0 ? images : undefined);
      setMessage('');
      setImages([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          setImages(prev => [...prev, dataUrl]);
        };
        reader.readAsDataURL(file);
      }
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div 
      className={`px-4 py-4 border-t backdrop-blur-sm ${theme === 'dark' ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'}`}
      style={customStyles}
    >
      {images.length > 0 && (
        <div className="flex gap-2 mb-2 flex-wrap">
          {images.map((img, idx) => (
            <div key={idx} className="relative w-15 h-15 rounded overflow-hidden">
              <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
              <button 
                type="button"
                className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/70 text-white text-base font-bold flex items-center justify-center p-0 border-0 cursor-pointer"
                onClick={() => removeImage(idx)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      <form className="flex gap-3 items-end" onSubmit={handleSubmit}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageUpload}
        />
        
        <button
          type="button"
          className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 border-0 cursor-pointer transition-all duration-200 ${
            theme === 'dark' 
              ? 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800'
          } ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105'}`}
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          title="Upload image"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg>
        </button>

        <textarea
          className={`flex-1 h-10 min-h-[40px] max-h-[120px] px-3 py-2.5 border-0 rounded-xl resize-none font-sans text-sm leading-normal transition-all duration-200 ${
            theme === 'dark'
              ? 'bg-gray-700/50 text-white focus:bg-gray-700/70'
              : 'bg-gray-50 text-gray-900 focus:bg-white'
          } focus:outline-none focus:ring-2 focus:ring-opacity-20`}
          style={{ 
            focusRingColor: accentColor,
            '--tw-ring-color': accentColor + '20'
          } as React.CSSProperties}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Connecting...' : 'Type a message...'}
          disabled={disabled}
          rows={1}
        />

        <button
          type="submit"
          className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 border-0 cursor-pointer transition-all duration-200 text-white ${
            disabled || (!message.trim() && images.length === 0) 
              ? 'opacity-40 cursor-not-allowed' 
              : 'hover:scale-105 hover:shadow-lg'
          }`}
          style={{
            backgroundColor: disabled || (!message.trim() && images.length === 0) ? '#6B7280' : accentColor,
            boxShadow: disabled || (!message.trim() && images.length === 0) ? 'none' : `0 4px 12px ${accentColor}40`
          }}
          disabled={disabled || (!message.trim() && images.length === 0)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </form>
    </div>
  );
};
