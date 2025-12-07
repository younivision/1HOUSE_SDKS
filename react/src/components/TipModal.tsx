import React, { useState, useEffect } from 'react';

interface TipModalProps {
  visible: boolean;
  onClose: () => void;
  onSendTip: (amount: number, recipientId: string, recipientName: string) => void;
  recipientId?: string;
  recipientName?: string;
  theme?: 'dark' | 'light';
  variant?: 'default' | 'twitch'; // Variant to match TwitchStream colors
  walletBalance?: number; // Current wallet balance in tokens
  onFundWallet?: () => void; // Callback when user wants to fund wallet
}

const QUICK_TIP_AMOUNTS = [5, 10, 25, 50, 100];

export const TipModal: React.FC<TipModalProps> = ({
  visible,
  onClose,
  onSendTip,
  recipientId,
  recipientName = 'Streamer',
  theme = 'dark',
  variant = 'default',
  walletBalance = 0,
  onFundWallet,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showKeypad, setShowKeypad] = useState(false);
  const [backdropOpacity, setBackdropOpacity] = useState(0);
  const [modalOpacity, setModalOpacity] = useState(0);
  const [modalScale, setModalScale] = useState(0.9);

  useEffect(() => {
    if (visible) {
      setBackdropOpacity(1);
      setModalOpacity(1);
      setModalScale(1);
    } else {
      setBackdropOpacity(0);
      setModalOpacity(0);
      setModalScale(0.9);
    }
  }, [visible]);

  const handleQuickTip = (amount: number) => {
    if (recipientId) {
      // Check if user has sufficient balance
      if (walletBalance !== undefined && amount > walletBalance) {
        // If onFundWallet is provided, call it; otherwise just prevent the tip
        if (onFundWallet) {
          onFundWallet();
        }
        return;
      }
      onSendTip(amount, recipientId, recipientName);
      handleClose();
    }
  };

  const handleCustomTip = () => {
    const amount = parseFloat(customAmount);
    if (amount > 0 && recipientId) {
      // Check if user has sufficient balance
      if (walletBalance !== undefined && amount > walletBalance) {
        // If onFundWallet is provided, call it; otherwise just prevent the tip
        if (onFundWallet) {
          onFundWallet();
        }
        return;
      }
      onSendTip(amount, recipientId, recipientName);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedAmount(null);
    setCustomAmount('');
    setShowKeypad(false);
    onClose();
  };

  const handleKeypadPress = (value: string) => {
    if (value === 'clear') {
      setCustomAmount('');
    } else if (value === 'backspace') {
      setCustomAmount(prev => prev.slice(0, -1));
    } else {
      setCustomAmount(prev => prev + value);
    }
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{
        backgroundColor: `rgba(0, 0, 0, ${backdropOpacity * 0.5})`,
        transition: 'background-color 0.3s ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
      onClick={handleClose}
    >
      <div
        className={`w-full max-w-md rounded-2xl p-6 max-h-[90vh] overflow-y-auto shadow-2xl ${
          variant === 'twitch'
            ? 'bg-gray-900' // Match TwitchStream's main background
            : theme === 'dark'
            ? 'bg-gray-800'
            : 'bg-white'
        }`}
        style={{
          opacity: modalOpacity,
          transform: `scale(${modalScale})`,
          transition: 'opacity 0.3s ease, transform 0.3s ease',
          pointerEvents: visible ? 'auto' : 'none',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex justify-between items-center mb-4 pb-4 border-b ${
          variant === 'twitch' ? 'border-gray-700' : 'border-white/10'
        }`}>
          <h3 className={`text-xl font-semibold font-display ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Send a Tip
          </h3>
          <button
            onClick={handleClose}
            className={`text-2xl font-light ${theme === 'dark' ? 'text-white' : 'text-gray-900'} hover:opacity-70 transition-opacity`}
          >
            ×
          </button>
        </div>

        {/* Wallet Balance Display */}
        <div className={`mb-6 p-4 rounded-lg ${
          variant === 'twitch'
            ? 'bg-gray-800 border border-gray-700'
            : theme === 'dark'
            ? 'bg-gray-700/50 border border-gray-600'
            : 'bg-gray-50 border border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-white/60' : 'text-gray-500'}`}>
                Wallet Balance
              </p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {walletBalance.toLocaleString()} Tokens
              </p>
            </div>
            <button
              onClick={() => onFundWallet?.()}
              className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                variant === 'twitch'
                  ? 'bg-[#269f47] hover:bg-[#13712d] text-white'
                  : 'bg-[#269f47] hover:bg-[#13712d] text-white'
              }`}
            >
              Fund Wallet
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {!showKeypad ? (
            <>
              <div>
                <div className="grid grid-cols-3 gap-2">
                  {QUICK_TIP_AMOUNTS.map((amount) => {
                    const hasInsufficientBalance = walletBalance !== undefined && amount > walletBalance;
                    return (
                    <button
                      key={amount}
                      onClick={() => {
                        setSelectedAmount(amount);
                        handleQuickTip(amount);
                      }}
                        disabled={hasInsufficientBalance}
                        className={`px-3 py-3 rounded-xl transition-all ${
                          hasInsufficientBalance
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        } ${
                        selectedAmount === amount
                            ? 'bg-[#269f47] text-white shadow-lg scale-105'
                            : variant === 'twitch'
                            ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
                          : theme === 'dark'
                            ? 'bg-gray-700 text-white hover:bg-gray-600 border border-gray-600'
                            : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200'
                      }`}
                        title={hasInsufficientBalance ? 'Insufficient balance. Click "Fund Wallet" to add tokens.' : ''}
                    >
                        <span className="font-bold text-base">{amount}</span>
                    </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => setShowKeypad(true)}
                className={`w-full px-4 py-3 rounded-xl border font-medium text-sm transition-colors ${
                  variant === 'twitch'
                    ? 'border-gray-700 bg-gray-800 text-white hover:bg-gray-700'
                    : theme === 'dark'
                    ? 'border-gray-600 bg-gray-700 text-white hover:bg-gray-600'
                    : 'border-gray-300 bg-gray-50 text-gray-900 hover:bg-gray-100'
                }`}
              >
                Custom Amount
              </button>

              <button
                onClick={handleClose}
                className={`w-full px-4 py-3 rounded-xl border font-semibold text-sm transition-colors ${
                  variant === 'twitch'
                    ? 'border-gray-700 bg-gray-800 text-white hover:bg-gray-700'
                    : theme === 'dark'
                    ? 'border-gray-600 bg-gray-700 text-white hover:bg-gray-600'
                    : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
            </>
          ) : (
            <div className="space-y-4">
              <div className={`text-center p-6 rounded-lg ${
                variant === 'twitch'
                  ? 'bg-[#269f47]/10'
                  : theme === 'dark'
                  ? 'bg-[#269f47]/10'
                  : 'bg-green-50'
              }`}>
                <p className={`text-xs mb-2 ${theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>Amount</p>
                <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {customAmount || '0'} Tokens
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleKeypadPress(num.toString())}
                    className={`px-4 py-3 rounded-xl font-semibold text-sm ${
                      variant === 'twitch'
                        ? 'bg-gray-800 text-white hover:bg-gray-700'
                        : theme === 'dark'
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => handleKeypadPress('clear')}
                  className={`px-4 py-3 rounded-xl font-semibold text-sm ${
                    variant === 'twitch'
                      ? 'bg-gray-800 text-white hover:bg-gray-700'
                      : theme === 'dark'
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  } transition-colors`}
                >
                  C
                </button>
                <button
                  onClick={() => handleKeypadPress('0')}
                  className={`px-4 py-3 rounded-xl font-semibold text-sm ${
                    variant === 'twitch'
                      ? 'bg-gray-800 text-white hover:bg-gray-700'
                      : theme === 'dark'
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  } transition-colors`}
                >
                  0
                </button>
                <button
                  onClick={() => handleKeypadPress('backspace')}
                  className={`px-4 py-3 rounded-xl font-semibold text-sm ${
                    variant === 'twitch'
                      ? 'bg-gray-800 text-white hover:bg-gray-700'
                      : theme === 'dark'
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  } transition-colors`}
                >
                  ⌫
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowKeypad(false);
                    setCustomAmount('');
                  }}
                  className={`flex-1 px-4 py-3 rounded-xl border font-medium text-sm ${
                    variant === 'twitch'
                      ? 'border-gray-700 bg-gray-800 text-white hover:bg-gray-700'
                      : theme === 'dark'
                      ? 'border-gray-600 bg-gray-700 text-white hover:bg-gray-600'
                      : 'border-gray-300 bg-gray-50 text-gray-900 hover:bg-gray-100'
                  } transition-colors`}
                >
                  Back
                </button>
                <button
                  onClick={handleCustomTip}
                  disabled={
                    !customAmount || 
                    parseFloat(customAmount) <= 0 || 
                    (walletBalance !== undefined && parseFloat(customAmount) > walletBalance)
                  }
                  className="flex-1 px-4 py-3 rounded-xl bg-[#269f47] text-white font-semibold text-sm hover:bg-[#13712d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title={
                    walletBalance !== undefined && parseFloat(customAmount) > walletBalance
                      ? 'Insufficient balance. Click "Fund Wallet" to add tokens.'
                      : ''
                  }
                >
                  Send Tip
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

