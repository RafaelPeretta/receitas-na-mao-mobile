import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

interface Props {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
}

const LoadingSpinner = ({ 
  message = 'Carregando...', 
  size = 'large', 
  color = '#003366' // Nosso azul
}: Props) => {
  return (
    <View style={styles.spinnerContainer}>
      <ActivityIndicator size={size} color={color} />
      <Text style={styles.spinnerText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f7f6', // Fundo cinza claro
  },
  spinnerText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});

export default LoadingSpinner;