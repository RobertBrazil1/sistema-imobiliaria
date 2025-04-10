import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../components/Header';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyFilter } from '../components/PropertyFilter';
import { Input } from '../components/Input';
import { propertyService } from '../services/api';
import { Property } from '../services/api';
import { theme } from '../utils/theme';

export const SearchScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState({
    propertyType: 'all',
    priceRange: 'all',
    location: 'all',
  });

  useEffect(() => {
    loadProperties();
  }, [searchQuery, filters]);

  const loadProperties = async () => {
    try {
      const data = await propertyService.getAllProperties();
      // Filtrar imóveis com base na query de busca e filtros
      const filteredData = data.filter(property => {
        const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            property.address.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filters.propertyType === 'all' || property.type === filters.propertyType;
        const matchesLocation = filters.location === 'all' || property.location === filters.location;
        return matchesSearch && matchesType && matchesLocation;
      });
      setProperties(filteredData);
    } catch (error) {
      console.error('Erro ao carregar imóveis:', error);
    }
  };

  const handlePropertyPress = (propertyId: string) => {
    navigation.navigate('PropertyDetails', { propertyId });
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <View style={styles.container}>
      <Header title="Buscar Imóveis" showBack onBackPress={() => navigation.goBack()} />

      <View style={styles.searchContainer}>
        <Input
          placeholder="Buscar por título ou endereço"
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon="search"
        />
      </View>

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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    padding: theme.spacing.md,
  },
  listContent: {
    padding: theme.spacing.md,
  },
}); 