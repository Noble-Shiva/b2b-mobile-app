import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { selectIsDark } from '@/store/themeSlice';
import { useSelector } from 'react-redux';


interface BackButtonProps {
  onPress?: () => void;
  color?: string;
  size?: number;
}

export default function BackButton({ 
  onPress, 
  color,
  size = 24 
}: BackButtonProps) {
  const router = useRouter();
  const isDark = useSelector(selectIsDark);
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };
  
  return (
    <TouchableOpacity 
      style={styles.backButton}
      onPress={handlePress}
      hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
    >
      <ArrowLeft 
        size={size} 
        color={color || (isDark ? '#FFFFFF' : '#333333')} 
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});