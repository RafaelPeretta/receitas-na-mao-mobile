import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Bem-vindo ao Receitas na Mão!</Text>
        <Text style={styles.subtitle}>
          Use as abas abaixo para buscar novas receitas ou ver o seu livro de receitas salvo.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6' },
  content: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#003366', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#333', textAlign: 'center' },
});