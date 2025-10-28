import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function BuscaScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Buscar Receitas</Text>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6' },
  content: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#003366', marginBottom: 10 },
});