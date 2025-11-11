import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { initDb } from '../database/db'; 
import Toast from 'react-native-toast-message'; // 1. IMPORTAR O TOAST

export default function RootLayout() {

  useEffect(() => {
    console.log("App Mobile carregado. Inicializando o banco de dados...");
    initDb().catch(err => console.error("Falha ao inicializar o DB Mobile:", err));
  }, []); 

  return (
    // Usamos um Fragment <> para ter o Stack e o Toast como "irmãos"
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
      </Stack>
      
      {/* 2. ADICIONAR O COMPONENTE TOAST AQUI */}
      {/* Ele ficará flutuando sobre todo o app */}
      <Toast />
    </>
  );
}