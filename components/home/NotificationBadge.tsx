import React from 'react';
import { StyleSheet } from 'react-native';
import { Badge } from '@/components/ui';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';

interface NotificationBadgeProps {
  count: number;
}

export default function NotificationBadge({ count }: NotificationBadgeProps) {
  if (count <= 0) return null;
  
  const isDark = useSelector(selectIsDark);
  
  return (
    <Badge count={count} variant="primary" size="small" style={styles.badge} />
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
  },
});