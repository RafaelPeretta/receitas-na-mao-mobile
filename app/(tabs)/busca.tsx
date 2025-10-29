import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Alert
} from 'react-native';

// Importa nossas funções de API e DB
import { buscarReceitasPorDescricao } from '../../services/api';
import { salvarReceita } from '../../database/db';
// Importa a interface Receita (se você quiser tipar o estado 'receitas' melhor)
// import { Receita } from '../../database/db';

export default function BuscaScreen() {
  // 1. Estados
  const [termo, setTermo] = useState('');
  const [receitas, setReceitas] = useState<any[]>([]); // Array para os resultados da API
  const [isLoading, setIsLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');

  // 2. Função para buscar na API
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

  // 3. Função para salvar no Banco de Dados
  const handleSalvarReceita = async (receitaAPI: any) => {
    console.log("Salvando receita (Mobile):", receitaAPI.strMeal);
    try {
      await salvarReceita(receitaAPI);
      Alert.alert('Sucesso!', `Receita "${receitaAPI.strMeal}" salva no seu Livro!`);
    } catch (error) {
      console.error("Erro ao salvar (Tela Busca):", error);
      Alert.alert('Erro', 'Não foi possível salvar a receita.');
    }
  };

  // 4. Componente para renderizar cada item da lista (Card da Receita)
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

  // 5. Interface da Tela
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

        {isLoading && <ActivityIndicator size="large" color="#003366" style={{ marginVertical: 20 }} />}

        {mensagem && !isLoading && <Text style={styles.mensagem}>{mensagem}</Text>}

        <FlatList
          data={receitas}
          renderItem={renderReceitaCard}
          keyExtractor={(item) => item.idMeal}
          style={styles.list}
        />
      </View>
    </SafeAreaView>
  );
}

// 6. Estilos (Agora exportado)
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
  mensagem: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#555',
    marginTop: 20,
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