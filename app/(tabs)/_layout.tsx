import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Usaremos ícones

export default function TabLayout() {
  return (
    // Configura o 'Tabs' (Bottom Tab Navigator)
    <Tabs
      screenOptions={({ route }) => ({
        // Define a cor dos ícones e texto
        tabBarActiveTintColor: '#003366', // Nosso azul
        tabBarInactiveTintColor: 'gray',
        
        // Define o ícone com base no nome da rota
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: any;

          // Os nomes aqui correspondem aos nomes dos ARQUIVOS dentro de app/(tabs)/
          if (route.name === 'index') { 
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'busca') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'meu-livro') {
            iconName = focused ? 'book' : 'book-outline';
          }

          // Fallback icon if needed
          if (!iconName) {
            iconName = 'help-circle-outline'; 
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* 1ª Aba: Home */}
      <Tabs.Screen
        name="index" // Nome do arquivo: app/(tabs)/index.tsx
        options={{
          title: 'Início',
          headerShown: false, // Esconde o header padrão da aba
        }}
      />
      {/* 2ª Aba: Busca */}
      <Tabs.Screen
        name="busca" // Nome do arquivo: app/(tabs)/busca.tsx
        options={{
          title: 'Buscar Receitas',
          headerShown: false,
        }}
      />
      {/* 3ª Aba: Meu Livro */}
      <Tabs.Screen
        name="meu-livro" // Nome do arquivo: app/(tabs)/meu-livro.tsx
        options={{
          title: 'Meu Livro',
          headerShown: false,
        }}
      />
    </Tabs>
  );
}