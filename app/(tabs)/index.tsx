import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  Image,
  Button,
  Alert,
  ScrollView // <-- 1. IMPORTAÇÃO ADICIONADA AQUI
} from 'react-native';
import { useFocusEffect } from 'expo-router'; // Para recarregar
import Toast from 'react-native-toast-message';

// Nossas importações
import { buscarReceitaAleatoria } from '../../services/api';
import { salvarReceita } from '../../database/db';
import LoadingSpinner from '../../components/LoadingSpinner'; // Nosso novo spinner

export default function HomeScreen() {
  const [receita, setReceita] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Função para buscar uma nova receita
  const fetchReceitaDoDia = async () => {
    setIsLoading(true);
    setReceita(null); // Limpa a receita antiga
    try {
      const novaReceita = await buscarReceitaAleatoria();
      setReceita(novaReceita);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível buscar uma nova receita.");
    } finally {
      setIsLoading(false);
    }
  };

  // Carrega uma receita quando a tela ganha foco pela primeira vez
  useFocusEffect(
    React.useCallback(() => {
      if (!receita) { 
        fetchReceitaDoDia();
      }
    }, [receita]) // Depende de 'receita'
  );

  // Função para salvar a sugestão
  const handleSalvar = async () => {
    if (!receita) return;
    
    try {
      await salvarReceita(receita);
      Toast.show({
        type: 'success',
        text1: 'Sucesso!',
        text2: `Receita "${receita.strMeal}" salva no seu Livro!`
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar esta receita.");
    }
  };

  // Se estiver carregando, mostra o spinner
  if (isLoading) {
    return <LoadingSpinner message="Buscando uma sugestão..." />;
  }

  // Se não encontrar receita
  if (!receita) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Erro ao carregar</Text>
          <Text style={styles.subtitle}>Não foi possível encontrar uma sugestão. Tente novamente.</Text>
          <View style={styles.buttonContainer}>
            <Button title="Tentar Novamente" onPress={fetchReceitaDoDia} color="#003366" />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Se encontrar, mostra o card da receita
  return (
    <SafeAreaView style={styles.container}>
      {/* 2. ScrollView agora é reconhecido */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.headerTitle}>Receita do Dia</Text>
        
        {/* Card da Receita */}
        <View style={styles.receitaCard}>
          <Image source={{ uri: receita.strMealThumb }} style={styles.receitaImagem} />
          <Text style={styles.receitaTitulo}>{receita.strMeal}</Text>
          <Text style={styles.receitaCategoria}>Categoria: {receita.strCategory}</Text>
          
          <View style={styles.buttonContainer}>
            <Button 
              title="Salvar no meu Livro" 
              onPress={handleSalvar}
              color="#99CC33" // Verde
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button 
              title="Buscar Outra Sugestão" 
              onPress={fetchReceitaDoDia} // Busca uma nova
              color="#003366" // Azul
            />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// Estilos melhorados
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f6',
  },
  content: {
    padding: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 15,
  },
  // Card (baseado nos estilos de busca.tsx)
  receitaCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  receitaImagem: {
    width: '100%',
    height: 200, // Imagem maior
    borderRadius: 4,
    marginBottom: 10,
  },
  receitaTitulo: {
    fontSize: 20, // Título maior
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 5,
  },
  receitaCategoria: {
    fontSize: 16,
    color: '#555',
    fontStyle: 'italic',
    marginBottom: 15,
  },
  buttonContainer: {
    marginTop: 10,
    overflow: 'hidden',
    borderRadius: 4,
  },
  // Para a tela de erro
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  }
});