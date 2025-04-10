import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, Dimensions } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  ImovelDetalhes: { imovel: Imovel };
};

type ImovelDetalhesScreenRouteProp = RouteProp<RootStackParamList, 'ImovelDetalhes'>;
type ImovelDetalhesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ImovelDetalhes'>;

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

interface Props {
  route: ImovelDetalhesScreenRouteProp;
  navigation: ImovelDetalhesScreenNavigationProp;
}

export default function ImovelDetalhes({ route }: Props) {
  const { imovel } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imovel.fotos[0] }}
          style={styles.image}
        />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{imovel.titulo}</Text>
        
        <Text style={styles.price}>
          R$ {imovel.valor.toLocaleString('pt-BR')}
        </Text>
        
        <View style={styles.tags}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{imovel.tipo}</Text>
          </View>
          {imovel.aceitaFinanciamento && (
            <View style={[styles.tag, styles.financiamentoTag]}>
              <Text style={styles.tagText}>Financiamento</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.description}>{imovel.descricao}</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Endereço</Text>
          <Text style={styles.sectionText}>{imovel.endereco}</Text>
          <Text style={styles.sectionText}>
            {imovel.cidade} - {imovel.estado}
          </Text>
          <Text style={styles.sectionText}>CEP: {imovel.cep}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Características</Text>
          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Área</Text>
              <Text style={styles.detailValue}>{imovel.area}m²</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Quartos</Text>
              <Text style={styles.detailValue}>{imovel.quartos}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Banheiros</Text>
              <Text style={styles.detailValue}>{imovel.banheiros}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Vagas</Text>
              <Text style={styles.detailValue}>{imovel.vagasGaragem}</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  imageContainer: {
    height: 300,
  },
  image: {
    width: width,
    height: '100%',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 16,
  },
  tags: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  financiamentoTag: {
    backgroundColor: '#dcfce7',
  },
  tagText: {
    fontSize: 14,
    color: '#374151',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    backgroundColor: 'white',
    padding: 16,
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
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
  },
}); 