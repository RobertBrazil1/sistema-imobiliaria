import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { PropertyDetails } from '../components/PropertyDetails';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { propertyService } from '../services/api';
import { Property } from '../services/api';
import { theme } from '../utils/theme';

type RouteParams = {
  propertyId: string;
};

export const PropertyDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { propertyId } = route.params as RouteParams;
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPropertyDetails();
  }, [propertyId]);

  const loadPropertyDetails = async () => {
    try {
      const data = await propertyService.getPropertyById(propertyId);
      setProperty(data);
    } catch (error) {
      console.error('Erro ao carregar detalhes do imóvel:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactAgent = () => {
    // Implementar lógica de contato com o corretor
  };

  if (loading || !property) {
    return (
      <View style={styles.container}>
        <Header title="Carregando..." showBack onBackPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Detalhes do Imóvel"
        showBack
        onBackPress={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.content}>
        <PropertyDetails property={property} />
        
        <View style={styles.actions}>
          <Button
            title="Entrar em Contato"
            onPress={handleContactAgent}
            variant="primary"
            size="large"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  actions: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
}); 