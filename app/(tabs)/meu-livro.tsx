import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  Button,
  StyleSheet,
  SafeAreaView,
  Alert
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { getReceitasSalvas, deletarReceita, Receita } from '../../database/db';
import { styles as buscaStyles } from './busca'; // Importa estilos
import Toast from 'react-native-toast-message';

// 1. IMPORTAR O NOVO SPINNER
import LoadingSpinner from '../../components/LoadingSpinner';

export default function MeuLivroScreen() {
  const [receitasSalvas, setReceitasSalvas] = useState<Receita[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // ... (carregarReceitas, useFocusEffect, handleDeletar continuam os mesmos) ...
  const carregarReceitas = async () => {
    setIsLoading(true);
    try {
      const receitas = await getReceitasSalvas();
      setReceitasSalvas(receitas);
    } catch (error) {
      console.error("Erro ao carregar receitas salvas:", error);
      Alert.alert('Erro', 'Não foi possível carregar suas receitas.');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      carregarReceitas();
    }, [])
  );

  const handleDeletar = async (id: string, nome: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que quer deletar a receita "${nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletarReceita(id);
              Toast.show({
                type: 'success',
                text1: 'Sucesso!',
                text2: `Receita "${nome}" deletada!`
              });
              await carregarReceitas();
            } catch (error) {
              console.error("Erro ao deletar (Tela Meu Livro):", error);
              Alert.alert('Erro', 'Não foi possível deletar a receita.');
            }
          }
        }
      ]
    );
  };
  
  const handleEditar = (id: string) => {
    router.push({ pathname: '/editar', params: { receitaId: id } });
  };

  const renderReceitaSalvaCard = ({ item }: { item: Receita }) => (
    <View style={buscaStyles.receitaCard}>
      <Image
        source={{ uri: item.imagemUrl }}
        style={buscaStyles.receitaImagem}
      />
      <Text style={buscaStyles.receitaTitulo}>{item.nome}</Text>
      <View style={styles.actionsContainer}>
        <View style={styles.buttonWrapper}>
          <Button
            title="Editar"
            onPress={() => handleEditar(item.id)}
            color="#888" // Cinza para editar
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title="Remover"
            onPress={() => handleDeletar(item.id, item.nome)}
            color="#ff4d4d" // Vermelho
          />
        </View>
      </View>
    </View>
  );

  // 2. SUBSTITUIR o ActivityIndicator pelo LoadingSpinner
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Meu Livro de Receitas</Text>
          <LoadingSpinner message="Carregando seu livro..." />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Meu Livro de Receitas</Text>

        {receitasSalvas.length === 0 ? (
          // 3. MELHORAR o estado vazio
          <View style={buscaStyles.emptyContainer}>
            <Text style={buscaStyles.emptyText}>Seu livro de receitas está vazio.</Text>
            <Text style={[buscaStyles.emptyText, { fontSize: 14, marginTop: 10 }]}>
              Vá para a aba "Buscar Receitas" para adicionar algumas!
            </Text>
          </View>
        ) : (
          <FlatList
            data={receitasSalvas}
            renderItem={renderReceitaSalvaCard}
            keyExtractor={(item) => item.id}
            style={buscaStyles.list}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f6',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 15,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  buttonWrapper: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 4,
  }
});