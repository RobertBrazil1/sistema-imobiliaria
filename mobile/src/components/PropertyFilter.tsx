import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface PropertyFilterProps {
  onFilterChange: (filters: FilterValues) => void;
}

interface FilterValues {
  propertyType: string;
  priceRange: string;
  location: string;
}

export const PropertyFilter: React.FC<PropertyFilterProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterValues>({
    propertyType: 'all',
    priceRange: 'all',
    location: 'all',
  });

  const handleFilterChange = (key: keyof FilterValues, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterSection}>
        <Text style={styles.label}>Tipo de Imóvel</Text>
        <Picker
          selectedValue={filters.propertyType}
          onValueChange={(value) => handleFilterChange('propertyType', value)}
          style={styles.picker}
        >
          <Picker.Item label="Todos" value="all" />
          <Picker.Item label="Casa" value="house" />
          <Picker.Item label="Apartamento" value="apartment" />
          <Picker.Item label="Terreno" value="land" />
        </Picker>
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.label}>Faixa de Preço</Text>
        <Picker
          selectedValue={filters.priceRange}
          onValueChange={(value) => handleFilterChange('priceRange', value)}
          style={styles.picker}
        >
          <Picker.Item label="Todos" value="all" />
          <Picker.Item label="Até R$ 200.000" value="0-200000" />
          <Picker.Item label="R$ 200.000 - R$ 500.000" value="200000-500000" />
          <Picker.Item label="Acima de R$ 500.000" value="500000+" />
        </Picker>
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.label}>Localização</Text>
        <Picker
          selectedValue={filters.location}
          onValueChange={(value) => handleFilterChange('location', value)}
          style={styles.picker}
        >
          <Picker.Item label="Todas" value="all" />
          <Picker.Item label="Zona Sul" value="south" />
          <Picker.Item label="Zona Norte" value="north" />
          <Picker.Item label="Centro" value="downtown" />
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  filterSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  picker: {
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
}); 