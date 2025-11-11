import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getReceitaPorId, updateReceita, Receita } from '../database/db';
import Toast from 'react-native-toast-message';

const EditarReceitaScreen = () => {
  // 1. Hooks de navegação e parâmetros
  const params = useLocalSearchParams(); // Pega os parâmetros da rota
  const router = useRouter(); // Para navegar de volta
  const { receitaId } = params; // Pega o ID que passamos

  // 2. Estados
  const [receita, setReceita] = useState<Receita | null>(null);
  const [nome, setNome] = useState('');
  const [instrucoes, setInstrucoes] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 3. Carregar os dados da receita
  useEffect(() => {
    if (!receitaId) return;

    const carregarDados = async () => {
      setIsLoading(true);
      try {
        const dados = await getReceitaPorId(String(receitaId));
        if (dados) {
          setReceita(dados);
          setNome(dados.nome);
          setInstrucoes(dados.instrucoes || '');
        } else {
          Alert.alert('Erro', 'Receita não encontrada.');
          router.back();
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Não foi possível carregar a receita.');
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    carregarDados();
  }, [receitaId]);

  // 4. Salvar as alterações
  const handleSalvar = async () => {
    if (!nome) {
      Alert.alert('Erro', 'O nome não pode ficar vazio.');
      return;
    }
    
    try {
      await updateReceita(String(receitaId), nome, instrucoes);
      Toast.show({
        type: 'success',
        text1: 'Sucesso!',
        text2: 'Receita atualizada.'
      });
      router.back(); // Volta para a tela "Meu Livro"
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Carregando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* ScrollView permite rolar o formulário */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Nome da Receita</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Nome da Receita"
        />
        
        <Text style={styles.label}>Instruções</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={instrucoes}
          onChangeText={setInstrucoes}
          placeholder="Modo de preparo..."
          multiline={true} // Permite múltiplas linhas
          numberOfLines={15}
        />
        
        <View style={styles.buttonContainer}>
          <Button title="Salvar Alterações" onPress={handleSalvar} color="#99CC33" />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Cancelar" onPress={() => router.back()} color="#777" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Estilos para o formulário
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f6',
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  textarea: {
    height: 300, // Altura grande para o texto
    textAlignVertical: 'top', // Começa a digitar do topo (Android)
  },
  buttonContainer: {
    marginTop: 10,
    overflow: 'hidden',
    borderRadius: 4,
  }
});

export default EditarReceitaScreen;