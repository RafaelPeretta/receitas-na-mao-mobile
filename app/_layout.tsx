import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { initDb } from '../database/db'; 
import Toast from 'react-native-toast-message';

export default function RootLayout() {

  useEffect(() => {
    console.log("App Mobile carregado. Inicializando o banco de dados...");
    initDb().catch(err => console.error("Falha ao inicializar o DB Mobile:", err));
  }, []); 

  return (
    <>
      <Stack>
        <Stack.Screen 
          name="(tabs)" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="modal" 
          options={{ presentation: 'modal' }} 
        />
        
        {/* **** NOVA TELA DE EDIÇÃO **** */}
        <Stack.Screen
          name="editar" // Corresponde ao arquivo /app/editar.tsx
          options={{ 
            presentation: 'modal', // Abre como um modal por cima
            title: 'Editar Receita' // Título no header
          }}
        />
      </Stack>
      
      <Toast />
    </>
  );
}