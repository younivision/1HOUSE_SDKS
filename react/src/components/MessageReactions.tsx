import React, { useState } from 'react';
import { Reaction } from '../types';

interface MessageReactionsProps {
  messageId: string;
  reactions?: Reaction[];
  currentUserId: string;
  onAddReaction: (messageId: string, emoji: string) => void;
  onRemoveReaction: (messageId: string, emoji: string) => void;
  disabled?: boolean;
}

const COMMON_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '🔥'];

export const MessageReactions: React.FC<MessageReactionsProps> = ({
  messageId,
  reactions = [],
  currentUserId,
  onAddReaction,
  onRemoveReaction,
  disabled,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleReactionClick = (emoji: string) => {
    const reaction = reactions.find(r => r.emoji === emoji);
    if (reaction?.users.includes(currentUserId)) {
      onRemoveReaction(messageId, emoji);
    } else {
      onAddReaction(messageId, emoji);
    }
  };

  return (
    <div className="message-reactions">
      {reactions.map((reaction) => {
        const isActive = reaction.users.includes(currentUserId);
        return (
          <button
            key={reaction.emoji}
            className={`reaction-button ${isActive ? 'active' : ''}`}
            onClick={() => !disabled && handleReactionClick(reaction.emoji)}
            disabled={disabled}
            title={`${reaction.count} reaction${reaction.count !== 1 ? 's' : ''}`}
          >
            <span className="reaction-emoji">{reaction.emoji}</span>
            <span className="reaction-count">{reaction.count}</span>
          </button>
        );
      })}

      {!disabled && (
        <div className="reaction-picker-container">
          <button
            className="reaction-add-button"
            onClick={() => setShowPicker(!showPicker)}
            title="Add reaction"
          >
            +
          </button>
          
          {showPicker && (
            <div className="reaction-picker">
              {COMMON_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  className="reaction-picker-emoji"
                  onClick={() => {
                    handleReactionClick(emoji);
                    setShowPicker(false);
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

