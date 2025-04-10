import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../components/Header';
import { PropertyCard } from '../components/PropertyCard';
import { propertyService } from '../services/api';
import { Property } from '../services/api';
import { theme } from '../utils/theme';

export const FavoritesScreen = () => {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      // Aqui você implementaria a lógica para carregar os favoritos do usuário
      // Por enquanto, vamos usar dados mockados
      const data = await propertyService.getAllProperties();
      setFavorites(data.slice(0, 3)); // Apenas para demonstração
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyPress = (propertyId: string) => {
    navigation.navigate('PropertyDetails', { propertyId });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Favoritos" showBack onBackPress={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <Text>Carregando favoritos...</Text>
        </View>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Favoritos" showBack onBackPress={() => navigation.goBack()} />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum imóvel favorito</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Favoritos" showBack onBackPress={() => navigation.goBack()} />
      
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PropertyCard
            title={item.title}
            price={item.price}
            address={item.address}
            imageUrl={item.imageUrl}
            onPress={() => handlePropertyPress(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
  },
  listContent: {
    padding: theme.spacing.md,
  },
}); 