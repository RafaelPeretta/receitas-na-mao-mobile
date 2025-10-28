import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { initDb } from '../database/db'; // Importa nossa função do DB

export default function RootLayout() {

  // Efeito para inicializar o banco de dados UMA VEZ quando o app carregar
  useEffect(() => {
    console.log("App Mobile carregado. Inicializando o banco de dados...");
    initDb().catch(err => console.error("Falha ao inicializar o DB Mobile:", err));
  }, []); // O array vazio '[]' garante que rode só uma vez

  return (
    // Configura um Stack Navigator
    <Stack>
      {/* A primeira tela do Stack será o nosso grupo de abas */}
      <Stack.Screen 
        name="(tabs)" // Isso diz para carregar o layout de app/(tabs)/_layout.tsx
        options={{ headerShown: false }} // Esconde o header do Stack para vermos só as abas
      />
      {/* Aqui poderíamos adicionar outras telas fora das abas, como um Modal */}
      <Stack.Screen 
        name="modal" // Corresponde ao arquivo app/modal.tsx
        options={{ presentation: 'modal' }} 
      /> 
    </Stack>
  );
}