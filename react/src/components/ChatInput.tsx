import React, { useState, useRef, useCallback } from 'react';

interface ChatInputProps {
  onSend: (content: string, images?: string[]) => void;
  onTyping: (isTyping: boolean) => void;
  disabled?: boolean;
  theme?: 'light' | 'dark';
  customStyles?: any;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSend, 
  onTyping, 
  disabled,
  theme = 'dark',
  customStyles,
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
      className={`px-4 py-3 border-t ${theme === 'dark' ? 'bg-chat-dark-header border-chat-dark-border' : 'bg-gray-50 border-gray-200'}`}
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
      
      <form className="flex gap-2 items-end" onSubmit={handleSubmit}>
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
          className={`w-9 h-9 rounded flex items-center justify-center flex-shrink-0 text-lg font-sans border-0 cursor-pointer transition-all ${
            theme === 'dark' 
              ? 'bg-chat-dark-input hover:bg-opacity-80' 
              : 'bg-gray-100 hover:bg-gray-200'
          } ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105'}`}
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          title="Upload image"
        >
          📎
        </button>

        <textarea
          className={`flex-1 min-h-[36px] max-h-[120px] px-3 py-2 border rounded resize-none font-sans text-sm leading-normal ${
            theme === 'dark'
              ? 'bg-chat-dark-input text-chat-dark-text border-gray-600 focus:border-chat-primary'
              : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500'
          } focus:outline-none`}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Connecting...' : 'Type a message...'}
          disabled={disabled}
          rows={1}
        />

        <button
          type="submit"
          className={`w-9 h-9 rounded flex items-center justify-center flex-shrink-0 text-lg font-sans border-0 cursor-pointer transition-all bg-chat-primary text-white ${
            disabled || (!message.trim() && images.length === 0) 
              ? 'opacity-40 cursor-not-allowed' 
              : 'hover:bg-purple-700 hover:scale-105'
          }`}
          disabled={disabled || (!message.trim() && images.length === 0)}
        >
          🚀
        </button>
      </form>
    </div>
  );
};
