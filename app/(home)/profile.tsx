import { IconSymbol } from '@/components/ui/IconSymbol';
import { clearTokens } from '@/services/tokenManager';
import axios from 'axios';
import { Stack, useRouter } from 'expo-router';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Button, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import ProfileInfoRow from '../../components/ProfileInfoRow';
import VehicleInfoCard from '../../components/VehicleInfoCard';
import api from '../../services/api';
import { ProfileData } from '../../types/api';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const colors = {
    background: isDarkMode ? '#000000' : '#f0f0f0',
    infoContainer: isDarkMode ? '#1c1c1e' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    errorText: '#ff5252',
    sectionTitle: isDarkMode ? '#b0b0b0' : '#666666',
    logout: '#ff3b30',
  };

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Tenta buscar o perfil de usuário
      const response = await api.get('/users/my-profile');
      setProfile(response.data);
    } catch (err) {
      // 2. Se falhar com 404, tenta buscar o perfil de motorista
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        try {
          const driverResponse = await api.get('/drivers/my-profile');
          setProfile(driverResponse.data);
        } catch (driverErr) {
          console.error("Falha ao buscar perfil de motorista:", driverErr);
          setError('Não foi possível carregar seu perfil.');
        }
      } else {
        console.error("Falha ao buscar perfil de usuário:", err);
        setError('Ocorreu um erro ao carregar seu perfil.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  function formatPhone(raw: string) {
    const phone = parsePhoneNumberFromString(raw, 'BR');
    if (!phone) return raw;

    return phone.formatInternational();
  }

  const handleLogout = async () => {
    await clearTokens();
    router.replace('/(auth)/login');
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color={colors.text} style={{ marginTop: 50 }} />;
    }
    if (error || !profile) {
      return <Text style={{ color: colors.errorText, textAlign: 'center', marginTop: 50 }}>{error}</Text>;
    }

    return (
      <>
        <View style={[styles.infoContainer, { backgroundColor: colors.infoContainer }]}>
          <ProfileInfoRow label="Nome" value={profile.name} />
          <ProfileInfoRow label="Apelido" value={`@${profile.username}`} />
          <ProfileInfoRow label="E-mail" value={profile.email} />
          <ProfileInfoRow label="Telefone" value={formatPhone(profile.phone)} isLast={profile.role === 'user'} />
          {profile.role === 'driver' && (
            <ProfileInfoRow label="Tipo de Transporte" value={profile.transportType} isLast={true} />
          )}
        </View>

        <View style={styles.actionsContainer}>
          <Button title="Minha Carteira" onPress={() => router.push('/wallet')} />
        </View>

        {profile.role === 'driver' && profile.vehicles.length > 0 && (
          <View style={styles.vehiclesContainer}>
            <Text style={[styles.sectionTitle, { color: colors.sectionTitle }]}>Meus Veículos</Text>
            {profile.vehicles.map(vehicle => (
              <VehicleInfoCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <IconSymbol name="rectangle.portrait.and.arrow.right" size={22} color={colors.logout} />
          <Text style={[styles.logoutText, { color: colors.logout }]}>Sair</Text>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchProfile} />}
    >
      <Stack.Screen options={{ headerShown: true, title: 'Perfil' }} />
      {renderContent()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoContainer: {
    margin: 15,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  actionsContainer: {
    marginHorizontal: 15,
    marginTop: 20,
  },
  vehiclesContainer: {
    marginHorizontal: 15,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    padding: 10,
  },
  logoutText: {
    fontSize: 16,
    marginLeft: 8,
    fontWeight: 'bold',
  },
});
