import React from 'react';
import { MediaItem } from '../types';
import { useImageCache } from '../hooks/useImageCache';

interface MediaMessageProps {
  media: MediaItem[];
}

export const MediaMessage: React.FC<MediaMessageProps> = ({ media }) => {
  const { getCachedImage } = useImageCache();

  if (!media || media.length === 0) return null;

  return (
    <div className="chat-message-media">
      {media.map((item, index) => {
        if (item.type === 'image') {
          return (
            <img
              key={index}
              src={getCachedImage(item.url)}
              alt={`Media ${index + 1}`}
              className="media-image"
              loading="lazy"
            />
          );
        }

        if (item.type === 'gif') {
          return (
            <img
              key={index}
              src={item.url}
              alt={`GIF ${index + 1}`}
              className="media-gif"
            />
          );
        }

        if (item.type === 'video') {
          return (
            <video
              key={index}
              src={item.url}
              poster={item.thumbnail}
              controls
              className="media-video"
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
          );
        }

        return null;
      })}
    </div>
  );
};

