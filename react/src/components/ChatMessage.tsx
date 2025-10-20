import React, { useState } from 'react';
import { Message } from '../types';
import { useImageCache } from '../hooks/useImageCache';

interface ChatMessageProps {
  message: Message;
  isOwn: boolean;
  theme?: 'dark' | 'light';
  customStyles?: any;
  onReaction?: (messageId: string, emoji: string) => void;
  onReport?: (messageId: string, reason: string) => void;
  onDelete?: (messageId: string) => void;
  currentUserId?: string;
  isAdmin?: boolean;
}

const QUICK_REACTIONS = ['👍', '❤️', '😂', '🎉', '🔥', '👀', '😍', '🚀'];

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isOwn,
  theme = 'dark',
  customStyles,
  onReaction,
  onReport,
  onDelete,
  currentUserId,
  isAdmin = false
}) => {
  const { getCachedImage } = useImageCache();
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showHiddenMessage, setShowHiddenMessage] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Check if message is reported and should be hidden
  const isReported = message.reports && message.reports.length > 0;
  const isHidden = isReported && !showHiddenMessage && !isAdmin;

  if (message.isDeleted) {
    return (
      <div className={`flex gap-3 px-3 py-2 rounded transition-colors ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'} opacity-50`}>
        <div className="flex-1 text-sm italic opacity-70">
          🗑️ Message deleted
          {message.deletedBy && currentUserId && message.deletedBy !== message.userId && (
            <span className="ml-2 text-xs">(by moderator)</span>
          )}
        </div>
      </div>
    );
  }

  if (isHidden) {
    return (
      <div className={`flex gap-3 px-3 py-2 rounded transition-colors ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'} opacity-50`}>
        <div className="flex-1 flex items-center justify-between">
          <span className="text-sm italic opacity-70">Message hidden (reported {message.reports?.length || 0}x)</span>
          <button
            onClick={() => setShowHiddenMessage(true)}
            className={`text-xs px-2 py-1 rounded ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Show
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`group flex gap-3 px-3 py-2 rounded transition-colors ${
        isReported && !isHidden
          ? theme === 'dark' 
            ? 'bg-yellow-500/10 border border-yellow-500/30 hover:bg-yellow-500/15' 
            : 'bg-yellow-50 border border-yellow-300 hover:bg-yellow-100'
          : theme === 'dark' 
            ? 'bg-white/[0.03] hover:bg-white/[0.05]' 
            : 'bg-black/[0.02] hover:bg-black/[0.04]'
      } ${isOwn ? 'opacity-90' : ''}`}
      style={customStyles}
    >
      {!isOwn && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
          {message.avatar ? (
            <img 
              src={getCachedImage(message.avatar)} 
              alt={message.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center font-semibold text-sm font-sans text-white"
              style={{ backgroundColor: message.color }}
            >
              {message.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span 
            className="font-semibold text-sm font-display"
            style={{ color: message.color }}
          >
            {message.username}
          </span>
          <span className="text-xs font-sans opacity-50">
            {formatTime(message.timestamp)}
          </span>
          
          {/* Message menu (show on hover) */}
          <div className="relative ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`px-1.5 py-0.5 rounded text-[10px] ${
                theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-200'
              }`}
              title="Message options"
            >
              ⋮
            </button>
            
            {showMenu && (
              <div
                className={`absolute right-0 top-full mt-1 p-1 rounded-lg shadow-lg border z-50 min-w-[120px] ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-white/10'
                    : 'bg-white border-gray-200'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {!isOwn && (
                  <button
                    onClick={() => {
                      setShowReportDialog(true);
                      setShowMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs rounded transition-colors ${
                      theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                    }`}
                  >
                    ⚠️ Report
                  </button>
                )}
                {isReported && (isAdmin || showHiddenMessage) && (
                  <button
                    onClick={() => {
                      setShowHiddenMessage(!showHiddenMessage);
                      setShowMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs rounded transition-colors ${
                      theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                    }`}
                  >
                    {showHiddenMessage ? '🙈 Hide' : '👁️ Show'}
                  </button>
                )}
                {/* Delete option - for message owner or admin */}
                {(isOwn || isAdmin) && (
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this message?')) {
                        onDelete?.(message.messageId || message.id || '');
                        setShowMenu(false);
                      }
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs rounded transition-colors ${
                      theme === 'dark' 
                        ? 'hover:bg-red-500/20 text-red-400' 
                        : 'hover:bg-red-100 text-red-600'
                    }`}
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Report Dialog */}
        {showReportDialog && (
          <div 
            className={`fixed inset-0 bg-black/50 flex items-center justify-center z-[100]`}
            onClick={() => setShowReportDialog(false)}
          >
            <div 
              className={`p-6 rounded-lg shadow-xl max-w-md w-full mx-4 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Report Message</h3>
              <p className="text-sm opacity-70 mb-4">Why are you reporting this message?</p>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Enter reason..."
                className={`w-full p-3 rounded border text-sm min-h-[100px] ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-white/10 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    if (reportReason.trim() && onReport) {
                      onReport(message.messageId || message.id || '', reportReason);
                      setReportReason('');
                      setShowReportDialog(false);
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium text-sm transition-colors"
                >
                  Report
                </button>
                <button
                  onClick={() => {
                    setReportReason('');
                    setShowReportDialog(false);
                  }}
                  className={`flex-1 px-4 py-2 rounded font-medium text-sm transition-colors ${
                    theme === 'dark'
                      ? 'bg-white/10 hover:bg-white/20'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        {isReported && (isAdmin || showHiddenMessage) && (
          <div className="mb-2 px-2 py-1 rounded bg-yellow-500/20 border border-yellow-500/30">
            <span className="text-[10px] text-yellow-600 dark:text-yellow-400 font-semibold">
              ⚠️ Reported {message.reports?.length || 0}x
            </span>
          </div>
        )}
        
        <div className="text-sm font-sans leading-normal break-words">
          {message.content}
        </div>

        {message.media && message.media.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {message.media.map((item, idx) => {
              if (item.type === 'image' || item.type === 'gif') {
                return (
                  <img 
                    key={idx}
                    src={getCachedImage(item.url)} 
                    alt={`Media ${idx + 1}`}
                    className="max-w-[200px] max-h-[200px] rounded cursor-pointer object-cover"
                  />
                );
              }
              if (item.type === 'video') {
                return (
                  <video
                    key={idx}
                    src={item.url}
                    poster={item.thumbnail}
                    controls
                    className="max-w-[300px] max-h-[300px] rounded"
                    preload="metadata"
                  />
                );
              }
              return null;
            })}
          </div>
        )}

        {/* Reactions - Only add margin if reactions exist OR on hover */}
        <div className={`flex flex-wrap gap-1 items-center relative ${
          message.reactions && message.reactions.length > 0 ? 'mt-2' : 'mt-0 group-hover:mt-2'
        } transition-all`}>
          {message.reactions && message.reactions.length > 0 && message.reactions.map((reaction) => {
            const userReacted = currentUserId && reaction.users?.includes(currentUserId);
            return (
              <button
                key={reaction.emoji}
                onClick={() => onReaction?.(message.messageId || message.id || '', reaction.emoji)}
                className={`flex items-center gap-1 px-2 py-1 rounded-xl border text-xs font-sans transition-all ${
                  userReacted
                    ? theme === 'dark'
                      ? 'border-blue-500 bg-blue-500/20 hover:bg-blue-500/30'
                      : 'border-blue-600 bg-blue-50 hover:bg-blue-100'
                    : theme === 'dark'
                      ? 'border-white/10 bg-white/5 hover:bg-white/10'
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <span>{reaction.emoji}</span>
                <span className="font-semibold font-display text-[11px]">{reaction.count}</span>
              </button>
            );
          })}
          
          {/* Add Reaction Button - Shows on hover */}
          <div className="relative">
            <button
              onClick={() => setShowReactionPicker(!showReactionPicker)}
              className={`px-1.5 py-0.5 rounded-lg border text-[10px] transition-all opacity-0 group-hover:opacity-100 ${
                theme === 'dark'
                  ? 'border-white/10 bg-white/5 hover:bg-white/10'
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
              }`}
              title="Add reaction"
            >
              <span className="opacity-60 hover:opacity-100 transition-opacity">+</span>
            </button>
            
            {/* Reaction Picker */}
            {showReactionPicker && (
              <div 
                className={`absolute bottom-full mb-2 left-0 p-2 rounded-lg shadow-lg border z-50 ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-white/10'
                    : 'bg-white border-gray-200'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex gap-1">
                  {QUICK_REACTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        onReaction?.(message.messageId || message.id || '', emoji);
                        setShowReactionPicker(false);
                      }}
                      className={`px-2 py-1 rounded hover:scale-125 transition-transform text-lg ${
                        theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
