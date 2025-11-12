import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, ScrollView, 
  TouchableOpacity, Modal, FlatList, Image, Alert,
  Button // **** IMPORTAÇÃO DO BUTTON ADICIONADA ****
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { 
  getPlanejamento, 
  setPlanejamento, 
  removerDoPlanejamento, 
  getReceitasSalvas, 
  Receita 
} from '../../database/db'; // Agora 'getReceitasSalvas' existe
import LoadingSpinner from '../../components/LoadingSpinner';
import { styles as buscaStyles } from './busca'; // Reutilizar estilos do card

const DIAS_SEMANA = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

export default function PlanejadorScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [receitasSalvas, setReceitasSalvas] = useState<Receita[]>([]);
  const [plano, setPlano] = useState<Map<string, Receita>>(new Map());
  const [modalVisivel, setModalVisivel] = useState(false);
  const [slotAtual, setSlotAtual] = useState<string | null>(null);

  const carregarDados = async () => {
    setIsLoading(true);
    try {
      const receitasDB = await getReceitasSalvas();
      setReceitasSalvas(receitasDB);

      const planoMap = await getPlanejamento();

      const planoCompleto = new Map<string, Receita>();
      for (const [slotId, receitaId] of planoMap.entries()) {
        // **** TIPO (r: Receita) ADICIONADO ****
        const receita = receitasDB.find((r: Receita) => r.id === receitaId);
        if (receita) {
          planoCompleto.set(slotId, receita);
        }
      }
      setPlano(planoCompleto);

    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar o planejador.");
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      carregarDados();
    }, [])
  );

  // --- LÓGICA DO MODAL ---
  const handleSlotPress = (slotId: string) => {
    setSlotAtual(slotId);
    setModalVisivel(true);
  };

  const handleSelecionarReceita = async (receita: Receita) => {
    if (!slotAtual) return;
    await setPlanejamento(slotAtual, receita.id);
    setPlano(prevPlano => new Map(prevPlano).set(slotAtual, receita));
    setModalVisivel(false);
    setSlotAtual(null);
  };

  const handleRemoverReceita = async () => {
    if (!slotAtual) return;
    await removerDoPlanejamento(slotAtual);
    setPlano(prevPlano => {
      const novoPlano = new Map(prevPlano);
      novoPlano.delete(slotAtual);
      return novoPlano;
    });
    setModalVisivel(false);
    setSlotAtual(null);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Planejador Semanal</Text>
          <LoadingSpinner message="Carregando seu plano..." />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Planejador Semanal</Text>
        
        {DIAS_SEMANA.map((dia) => (
          <View key={dia} style={styles.diaCard}>
            <Text style={styles.diaTitulo}>{dia}</Text>
            <SlotRefeicao 
              receita={plano.get(`${dia}-almoco`)} 
              onPress={() => handleSlotPress(`${dia}-almoco`)}
              label="Almoço"
            />
            <SlotRefeicao 
              receita={plano.get(`${dia}-jantar`)} 
              onPress={() => handleSlotPress(`${dia}-jantar`)}
              label="Jantar"
            />
          </View>
        ))}
      </ScrollView>

      {/* --- O MODAL PARA SELECIONAR RECEITAS --- */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecione uma Receita</Text>
            <Button title="Cancelar" onPress={() => setModalVisivel(false)} color="#ff4d4d" />
          </View>
          
          {plano.has(slotAtual!) && (
             <View style={styles.modalButtonRemover}>
              <Button 
                title="Remover Receita do Plano" 
                onPress={handleRemoverReceita} 
                color="#ff4d4d"
              />
            </View>
          )}

          <FlatList
            data={receitasSalvas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={buscaStyles.receitaCard} 
                onPress={() => handleSelecionarReceita(item)}
              >
                <Image source={{ uri: item.imagemUrl }} style={buscaStyles.receitaImagem} />
                <Text style={buscaStyles.receitaTitulo}>{item.nome}</Text>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}

// Componente Helper para os Slots
const SlotRefeicao = ({ label, receita, onPress }: { label: string, receita?: Receita, onPress: () => void }) => {
  return (
    <View style={styles.refeicaoSlot}>
      <Text style={styles.refeicaoLabel}>{label}</Text>
      <TouchableOpacity style={styles.dropZone} onPress={onPress}>
        {receita ? (
          <View style={styles.receitaDragCard}>
            <Image source={{ uri: receita.imagemUrl }} style={styles.receitaDragImagem} />
            <Text style={styles.receitaDragNome} numberOfLines={2}>{receita.nome}</Text>
          </View>
        ) : (
          <Text style={styles.dropZoneVazio}>(Vazio)</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

// --- Estilos ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6' },
  content: { flex: 1, padding: 15 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#003366', marginBottom: 15 },
  
  // Layout do Calendário
  diaCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  diaTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  refeicaoSlot: {
    marginBottom: 10,
  },
  refeicaoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 5,
  },
  dropZone: {
    minHeight: 70,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 4,
    padding: 5,
    justifyContent: 'center',
  },
  dropZoneVazio: {
    color: '#999',
    textAlign: 'center',
  },
  
  // Card de Receita (Mini) dentro do slot
  receitaDragCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  receitaDragImagem: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 10,
  },
  receitaDragNome: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },

  // Estilos do Modal
  modalContainer: {
    flex: 1,
    padding: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003366',
  },
  modalButtonRemover: {
    marginBottom: 15,
    borderRadius: 4,
    overflow: 'hidden',
  }
});