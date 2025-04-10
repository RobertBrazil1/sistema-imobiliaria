import React, { useState } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { theme } from '../utils/theme';

export const ProfileScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState({
    name: 'João Silva',
    email: 'joao@exemplo.com',
    phone: '(11) 99999-9999',
    avatar: 'https://via.placeholder.com/150',
  });

  const handleEditProfile = () => {
    // Implementar navegação para tela de edição de perfil
  };

  const handleLogout = () => {
    // Implementar lógica de logout
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Header title="Meu Perfil" showBack onBackPress={() => navigation.goBack()} />

      <View style={styles.content}>
        <View style={styles.profileHeader}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Telefone</Text>
          <Text style={styles.infoValue}>{user.phone}</Text>
        </View>

        <View style={styles.actions}>
          <Button
            title="Editar Perfil"
            onPress={handleEditProfile}
            variant="secondary"
            size="large"
          />
          <Button
            title="Sair"
            onPress={handleLogout}
            variant="danger"
            size="large"
          />
        </View>
      </View>
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
    padding: theme.spacing.md,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: theme.spacing.md,
  },
  name: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  email: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
  },
  infoContainer: {
    marginBottom: theme.spacing.xl,
  },
  infoLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  infoValue: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.primary,
  },
  actions: {
    gap: theme.spacing.md,
  },
}); 