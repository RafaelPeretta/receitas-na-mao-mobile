import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, Image, Button, 
  StyleSheet, SafeAreaView, Alert, ActivityIndicator 
} from 'react-native';
import { useFocusEffect } from 'expo-router'; 
import { getReceitasSalvas, deletarReceita, Receita } from '../../database/db';
import { styles as buscaStyles } from './busca'; // Importa estilos
import Toast from 'react-native-toast-message'; // 1. IMPORTAR O TOAST

export default function MeuLivroScreen() {
  const [receitasSalvas, setReceitasSalvas] = useState<Receita[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ... (função carregarReceitas continua a mesma) ...
  const carregarReceitas = async () => {
    setIsLoading(true);
    console.log("Carregando receitas salvas (Mobile)...");
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
    // 1. MANTEMOS O ALERT DE CONFIRMAÇÃO (isso é uma boa UX)
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que quer deletar a receita "${nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Deletar', 
          style: 'destructive', 
          onPress: async () => {
            console.log("Deletando receita (Mobile):", id);
            try {
              await deletarReceita(id);
              
              // 2. SUBSTITUIR O 'Alert' de sucesso por 'Toast'
              Toast.show({
                type: 'success',
                text1: 'Sucesso!',
                text2: `Receita "${nome}" deletada!`
              });
              
              await carregarReceitas(); 
            } catch (error) {
              console.error("Erro ao deletar (Tela Meu Livro):", error);
              Alert.alert('Erro', 'Não foi possível deletar a receita.');
              // Ou podemos usar um toast de erro:
              // Toast.show({
              //   type: 'error',
              //   text1: 'Erro',
              //   text2: 'Não foi possível deletar a receita.'
              // });
            }
          } 
        }
      ]
    );
  };

  // ... (função renderReceitaSalvaCard e o return) ...
  // (Nenhuma mudança necessária no resto do arquivo)
  const renderReceitaSalvaCard = ({ item }: { item: Receita }) => (
    <View style={buscaStyles.receitaCard}> 
      <Image 
        source={{ uri: item.imagemUrl }} 
        style={buscaStyles.receitaImagem} 
      />
      <Text style={buscaStyles.receitaTitulo}>{item.nome}</Text>
      
      <View style={styles.buttonContainer}>
         <Button 
            title="Remover Receita" 
            onPress={() => handleDeletar(item.id, item.nome)}
            color="#ff4d4d" // Vermelho
          />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Meu Livro de Receitas</Text>

        {isLoading ? (
          <ActivityIndicator size="large" color="#003366" style={{ marginTop: 20 }} />
        ) : receitasSalvas.length === 0 ? (
          <Text style={buscaStyles.mensagem}>Você ainda não salvou nenhuma receita.</Text>
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
  buttonContainer: {
    marginTop: 10,
    overflow: 'hidden', 
    borderRadius: 4, 
  }
});