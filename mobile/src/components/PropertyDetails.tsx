import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { Property } from '../services/api';
import { formatCurrency, formatArea } from '../utils/formatters';

interface PropertyDetailsProps {
  property: Property;
}

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property }) => {
  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: property.imageUrl }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.title}>{property.title}</Text>
        <Text style={styles.price}>{formatCurrency(property.price)}</Text>
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Detalhes</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Área</Text>
              <Text style={styles.detailValue}>{formatArea(property.area)}</Text>
            </View>
            {property.bedrooms && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Quartos</Text>
                <Text style={styles.detailValue}>{property.bedrooms}</Text>
              </View>
            )}
            {property.bathrooms && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Banheiros</Text>
                <Text style={styles.detailValue}>{property.bathrooms}</Text>
              </View>
            )}
            {property.parkingSpaces && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Vagas</Text>
                <Text style={styles.detailValue}>{property.parkingSpaces}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.description}>{property.description}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Características</Text>
          <View style={styles.featuresList}>
            {property.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Localização</Text>
          <Text style={styles.address}>{property.address}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
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
    fontSize: 22,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  detailItem: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  featureItem: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
  },
  address: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
}); 