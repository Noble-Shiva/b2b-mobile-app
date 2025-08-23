import { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Send } from 'lucide-react-native';

import { colors } from '@/utils/theme';
import { selectIsDark } from '@/store/themeSlice';
import { useSelector } from 'react-redux';

interface ChatInputProps {
  onSend: (message: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const isDark = useSelector(selectIsDark);
  
  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };
  
  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
        borderTopColor: isDark ? '#333333' : '#EEEEEE' 
      }
    ]}>
      <TextInput
        style={[
          styles.input,
          { 
            backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5',
            color: isDark ? '#FFFFFF' : '#333333' 
          }
        ]}
        placeholder="Type a message..."
        placeholderTextColor={isDark ? '#888888' : '#999999'}
        value={message}
        onChangeText={setMessage}
        multiline
        maxLength={500}
      />
      <TouchableOpacity
        style={[
          styles.sendButton, 
          !message.trim() && { backgroundColor: '#CCCCCC' }
        ]}
        onPress={handleSend}
        disabled={!message.trim()}
      >
        <Send size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[700],
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});