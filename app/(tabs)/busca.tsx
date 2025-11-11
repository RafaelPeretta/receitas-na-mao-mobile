import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert
} from 'react-native';

// Importa nossas funções de API e DB
import { buscarReceitasPorDescricao } from '../../services/api';
import { salvarReceita } from '../../database/db';
import Toast from 'react-native-toast-message';

// 1. IMPORTAR O NOVO SPINNER
import LoadingSpinner from '../../components/LoadingSpinner';

export default function BuscaScreen() {
  const [termo, setTermo] = useState('');
  const [receitas, setReceitas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');

  // ... (handleBuscar e handleSalvarReceita continuam os mesmos) ...
  const handleBuscar = async () => {
    if (termo.trim() === '') return;
    setIsLoading(true);
    setReceitas([]);
    setMensagem('');
    try {
      const resultados = await buscarReceitasPorDescricao(termo);
      if (resultados.length > 0) {
        setReceitas(resultados);
      } else {
        setMensagem('Nenhuma receita encontrada para este termo.');
      }
    } catch (error) {
      console.error("Erro ao buscar (Tela Busca):", error);
      setMensagem('Erro ao conectar com a API.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSalvarReceita = async (receitaAPI: any) => {
    console.log("Salvando receita (Mobile):", receitaAPI.strMeal);
    try {
      await salvarReceita(receitaAPI);
      Toast.show({
        type: 'success',
        text1: 'Sucesso!',
        text2: `Receita "${receitaAPI.strMeal}" salva no seu Livro!`
      });
    } catch (error) {
      console.error("Erro ao salvar (Tela Busca):", error);
      Alert.alert('Erro', 'Não foi possível salvar a receita.');
    }
  };

  const renderReceitaCard = ({ item }: { item: any }) => (
    <View style={styles.receitaCard}>
      <Image
        source={{ uri: item.strMealThumb }}
        style={styles.receitaImagem}
      />
      <Text style={styles.receitaTitulo}>{item.strMeal}</Text>
      <Text style={styles.receitaIngredientes}>
        Ingredientes: {item.strIngredient1}, {item.strIngredient2}, {item.strIngredient3}...
      </Text>
      <View style={styles.buttonContainer}>
          <Button
            title="Salvar no meu Livro"
            onPress={() => handleSalvarReceita(item)}
            color="#99CC33" // Verde limão
          />
      </View>
    </View>
  );

  // 2. FUNÇÃO PARA RENDERIZAR O CONTEÚDO PRINCIPAL
  const renderContent = () => {
    // Se estiver carregando, mostra o spinner
    if (isLoading) {
      return <LoadingSpinner message="Buscando receitas..." />;
    }

    // Se tiver mensagem (ex: "Nenhum resultado"), mostra o estado vazio
    if (mensagem) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{mensagem}</Text>
        </View>
      );
    }

    // Se tiver receitas, mostra a lista
    if (receitas.length > 0) {
      return (
        <FlatList
          data={receitas}
          renderItem={renderReceitaCard}
          keyExtractor={(item) => item.idMeal}
          style={styles.list}
        />
      );
    }

    // Se não tiver buscado nada ainda, não mostra nada
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Buscar Receitas</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome do prato (ex: Chicken)"
            value={termo}
            onChangeText={setTermo}
          />
          <Button
            title={isLoading ? 'Buscando...' : 'Buscar'}
            onPress={handleBuscar}
            disabled={isLoading}
            color="#003366" // Azul
          />
        </View>
        
        {/* 3. CHAMA A FUNÇÃO DE RENDERIZAÇÃO */}
        {renderContent()}
      </View>
    </SafeAreaView>
  );
}

// 4. Estilos (Adiciona 'emptyContainer' e 'emptyText')
export const styles = StyleSheet.create({
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
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  // Renomeado de 'mensagem' para 'emptyText'
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: 16,
    color: '#555',
  },
  // Novo container para centralizar a mensagem
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  list: {
    marginTop: 10,
  },
  receitaCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  receitaImagem: {
    width: '100%',
    height: 180,
    borderRadius: 4,
    marginBottom: 10,
  },
  receitaTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 5,
  },
  receitaIngredientes: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
   buttonContainer: {
    marginTop: 10,
    overflow: 'hidden',
    borderRadius: 4,
  }
});