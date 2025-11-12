import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Usaremos ícones

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#003366', 
        tabBarInactiveTintColor: 'gray',
        
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: any;

          if (route.name === 'index') { 
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'busca') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'meu-livro') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'planejador') { // **** NOVO ÍCONE ****
            iconName = focused ? 'calendar' : 'calendar-outline';
          }

          if (!iconName) {
            iconName = 'help-circle-outline'; 
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* 1ª Aba: Home */}
      <Tabs.Screen
        name="index" 
        options={{ title: 'Início', headerShown: false }}
      />
      {/* 2ª Aba: Busca */}
      <Tabs.Screen
        name="busca" 
        options={{ title: 'Buscar Receitas', headerShown: false }}
      />
      {/* 3ª Aba: Meu Livro */}
      <Tabs.Screen
        name="meu-livro" 
        options={{ title: 'Meu Livro', headerShown: false }}
      />
      
      {/* **** NOVA ABA "PLANEJADOR" **** */}
      <Tabs.Screen
        name="planejador" // Corresponde a /app/(tabs)/planejador.tsx
        options={{
          title: 'Planejador',
          headerShown: false,
        }}
      />
    </Tabs>
  );
}