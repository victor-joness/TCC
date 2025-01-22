import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from '~/components/ui/card';
import BottomNavigation from '~/components/BottomNavBar/BottomNavBar';

export default function Screen() {
  const [activeKey, setActiveKey] = React.useState('modules');

  function handleNavigate(key: string) {
    setActiveKey(key);
  }

  return (
    <View style={styles.container}>
      <Card  style={[styles.card, { borderRadius: 0 }]}>
        
      </Card>
      <BottomNavigation currentPage={activeKey} onPageChange={handleNavigate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
  },
  card: {
    flex: 1,
    borderRadius: 0,
  },
});
