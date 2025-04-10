import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PropertyCard } from '../components/PropertyCard';
import { Header } from '../components/Header';
import { PropertyFilter } from '../components/PropertyFilter';
import { propertyService } from '../services/api';
import { Property } from '../services/api';
import { theme } from '../utils/theme';

export const HomeScreen = () => {
  const navigation = useNavigation();
  const [properties, setProperties] = useState<Property[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    propertyType: 'all',
    priceRange: 'all',
    location: 'all',
  });

  const loadProperties = async () => {
    try {
      const data = await propertyService.getAllProperties();
      setProperties(data);
    } catch (error) {
      console.error('Erro ao carregar imóveis:', error);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProperties();
    setRefreshing(false);
  };

  const handlePropertyPress = (propertyId: string) => {
    navigation.navigate('PropertyDetails', { propertyId });
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    // Aqui você implementaria a lógica de filtragem
  };

  return (
    <View style={styles.container}>
      <Header title="Imóveis Disponíveis" />
      
      <PropertyFilter onFilterChange={handleFilterChange} />
      
      <FlatList
        data={properties}
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.spacing.md,
  },
}); 