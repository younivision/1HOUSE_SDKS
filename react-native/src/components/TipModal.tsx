import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Theme, fonts } from '../styles';

interface TipModalProps {
  visible: boolean;
  onClose: () => void;
  onSendTip: (amount: number, recipientId: string, recipientName: string) => void;
  recipientId?: string;
  recipientName?: string;
  theme: Theme;
}

const QUICK_TIP_AMOUNTS = [5, 10, 25, 50, 100];

export const TipModal: React.FC<TipModalProps> = ({
  visible,
  onClose,
  onSendTip,
  recipientId,
  recipientName = 'Streamer',
  theme,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showKeypad, setShowKeypad] = useState(false);
  const backdropOpacity = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(300)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleQuickTip = (amount: number) => {
    if (recipientId) {
      onSendTip(amount, recipientId, recipientName);
      handleClose();
    }
  };

  const handleCustomTip = () => {
    const amount = parseFloat(customAmount);
    if (amount > 0 && recipientId) {
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
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View
        style={[
          styles.backdrop,
          { opacity: backdropOpacity },
        ]}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={handleClose}
        />
        
        <Animated.View
          style={[
            styles.modalContainer,
            {
              backgroundColor: theme.background,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text, fontFamily: fonts.displaySemiBold }]}>
              Send a Tip
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={[styles.closeText, { color: theme.text }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={[styles.recipientText, { color: theme.textSecondary, fontFamily: fonts.regular }]}>
              Tip to: {recipientName}
            </Text>

            {!showKeypad ? (
              <>
                <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: fonts.medium }]}>
                  Quick Tip Amounts
                </Text>
                <View style={styles.amountGrid}>
                  {QUICK_TIP_AMOUNTS.map((amount) => (
                    <TouchableOpacity
                      key={amount}
                      style={[
                        styles.amountButton,
                        {
                          backgroundColor: selectedAmount === amount ? '#269f47' : theme.inputBackground,
                          borderColor: selectedAmount === amount ? '#269f47' : theme.border,
                        },
                      ]}
                      onPress={() => {
                        setSelectedAmount(amount);
                        handleQuickTip(amount);
                      }}
                    >
                      <Text
                        style={[
                          styles.amountText,
                          {
                            color: selectedAmount === amount ? 'white' : theme.text,
                            fontFamily: fonts.semiBold,
                          },
                        ]}
                      >
                        {amount} Tokens
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  style={[styles.customButton, { borderColor: theme.border }]}
                  onPress={() => setShowKeypad(true)}
                >
                  <Text style={[styles.customButtonText, { color: theme.text, fontFamily: fonts.medium }]}>
                    Custom Amount
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.keypadContainer}>
                <View style={styles.customAmountDisplay}>
                  <Text style={[styles.customAmountLabel, { color: theme.textSecondary, fontFamily: fonts.regular }]}>
                    Amount
                  </Text>
                  <Text style={[styles.customAmountValue, { color: theme.text, fontFamily: fonts.bold }]}>
                    {customAmount || '0'} Tokens
                  </Text>
                </View>

                <View style={styles.keypad}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <TouchableOpacity
                      key={num}
                      style={[styles.keypadButton, { backgroundColor: theme.inputBackground }]}
                      onPress={() => handleKeypadPress(num.toString())}
                    >
                      <Text style={[styles.keypadText, { color: theme.text, fontFamily: fonts.semiBold }]}>
                        {num}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={[styles.keypadButton, { backgroundColor: theme.inputBackground }]}
                    onPress={() => handleKeypadPress('clear')}
                  >
                    <Text style={[styles.keypadText, { color: theme.text, fontFamily: fonts.medium }]}>
                      C
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.keypadButton, { backgroundColor: theme.inputBackground }]}
                    onPress={() => handleKeypadPress('0')}
                  >
                    <Text style={[styles.keypadText, { color: theme.text, fontFamily: fonts.semiBold }]}>
                      0
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.keypadButton, { backgroundColor: theme.inputBackground }]}
                    onPress={() => handleKeypadPress('backspace')}
                  >
                    <Text style={[styles.keypadText, { color: theme.text, fontFamily: fonts.medium }]}>
                      ⌫
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.keypadActions}>
                  <TouchableOpacity
                    style={[styles.keypadActionButton, { borderColor: theme.border }]}
                    onPress={() => {
                      setShowKeypad(false);
                      setCustomAmount('');
                    }}
                  >
                    <Text style={[styles.keypadActionText, { color: theme.text, fontFamily: fonts.medium }]}>
                      Back
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.keypadActionButton, { backgroundColor: '#269f47' }]}
                    onPress={handleCustomTip}
                    disabled={!customAmount || parseFloat(customAmount) <= 0}
                  >
                    <Text style={[styles.keypadActionText, { color: 'white', fontFamily: fonts.semiBold }]}>
                      Send Tip
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 24,
    fontWeight: '300',
  },
  content: {
    padding: 20,
  },
  recipientText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 15,
  },
  amountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  amountButton: {
    flex: 1,
    minWidth: '45%',
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
  },
  customButton: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  customButtonText: {
    fontSize: 16,
  },
  keypadContainer: {
    marginTop: 10,
  },
  customAmountDisplay: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
    borderRadius: 8,
    backgroundColor: 'rgba(38, 159, 71, 0.1)',
  },
  customAmountLabel: {
    fontSize: 12,
    marginBottom: 5,
  },
  customAmountValue: {
    fontSize: 24,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  keypadButton: {
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  keypadText: {
    fontSize: 20,
  },
  keypadActions: {
    flexDirection: 'row',
    gap: 10,
  },
  keypadActionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  keypadActionText: {
    fontSize: 16,
  },
});

