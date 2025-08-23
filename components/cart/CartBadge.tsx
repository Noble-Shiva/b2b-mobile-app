import { StyleSheet } from 'react-native';
import { Badge } from '@/components/ui';
import { useSelector } from 'react-redux';
import { selectTotalItems } from '@/store/cartSlice';

export default function CartBadge() {
  const count = useSelector(selectTotalItems);
  if (count <= 0) return null;
  
  return (
    <Badge count={count} variant="primary" size="small" style={styles.badge} />
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -2,
    right: -6,
  },
});