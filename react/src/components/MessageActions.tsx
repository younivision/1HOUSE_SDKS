import React, { useState } from 'react';

interface MessageActionsProps {
  messageId: string;
  isOwn: boolean;
  isAdmin: boolean;
  onDelete?: (messageId: string) => void;
  onReport?: (messageId: string, reason: string) => void;
  enableReporting?: boolean;
}

export const MessageActions: React.FC<MessageActionsProps> = ({
  messageId,
  isOwn,
  isAdmin,
  onDelete,
  onReport,
  enableReporting = true,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const handleDelete = () => {
    if (onDelete) {
      onDelete(messageId);
    }
    setShowMenu(false);
  };

  const handleReport = () => {
    if (onReport && reportReason) {
      onReport(messageId, reportReason);
    }
    setShowReportDialog(false);
    setShowMenu(false);
    setReportReason('');
  };

  return (
    <div className="message-actions">
      <button
        className="message-actions-button"
        onClick={() => setShowMenu(!showMenu)}
        title="Message actions"
      >
        ⋯
      </button>

      {showMenu && (
        <div className="message-actions-menu">
          {(isOwn || isAdmin) && onDelete && (
            <button
              className="message-action-item delete"
              onClick={handleDelete}
            >
              🗑️ Delete
            </button>
          )}
          
          {!isOwn && enableReporting && onReport && (
            <button
              className="message-action-item report"
              onClick={() => {
                setShowReportDialog(true);
                setShowMenu(false);
              }}
            >
              🚩 Report
            </button>
          )}
        </div>
      )}

      {showReportDialog && (
        <div className="message-report-dialog">
          <div className="message-report-content">
            <h3>Report Message</h3>
            <textarea
              placeholder="Why are you reporting this message?"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              rows={4}
            />
            <div className="message-report-actions">
              <button onClick={() => setShowReportDialog(false)}>
                Cancel
              </button>
              <button
                onClick={handleReport}
                disabled={!reportReason.trim()}
                className="primary"
              >
                Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

