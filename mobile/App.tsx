import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Image, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  ImovelDetalhes: { imovel: Imovel };
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ImovelDetalhes'>;

interface Imovel {
  id: number;
  titulo: string;
  descricao: string;
  valor: number;
  tipo: 'venda' | 'aluguel';
  aceitaFinanciamento: boolean;
  fotos: string[];
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  area: number;
  quartos: number;
  banheiros: number;
  vagasGaragem: number;
}

export default function HomeScreen() {
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  useEffect(() => {
    fetch('http://localhost:3000/imoveis')
      .then(response => response.json())
      .then(data => setImoveis(data));
  }, []);

  const renderItem = ({ item }: { item: Imovel }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('ImovelDetalhes', { imovel: item })}
    >
      <Image
        source={{ uri: item.fotos[0] }}
        style={styles.image}
      />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.titulo}</Text>
        <Text style={styles.price}>
          R$ {item.valor.toLocaleString('pt-BR')}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.descricao}
        </Text>
        <View style={styles.tags}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{item.tipo}</Text>
          </View>
          {item.aceitaFinanciamento && (
            <View style={[styles.tag, styles.financiamentoTag]}>
              <Text style={styles.tagText}>Financiamento</Text>
            </View>
          )}
        </View>
        <View style={styles.details}>
          <Text style={styles.detailText}>{item.quartos} quartos</Text>
          <Text style={styles.detailText}>{item.banheiros} banheiros</Text>
          <Text style={styles.detailText}>{item.vagasGaragem} vagas</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Imóveis</Text>
      </View>
      <FlatList
        data={imoveis}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2563eb',
    padding: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardContent: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 8,
  },
  description: {
    color: '#666',
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  financiamentoTag: {
    backgroundColor: '#dcfce7',
  },
  tagText: {
    fontSize: 12,
    color: '#374151',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    color: '#666',
  },
}); 