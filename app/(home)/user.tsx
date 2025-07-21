import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, useColorScheme, View } from 'react-native';
import TourPackageCard from '../../components/TourPackageCard';
import api from '../../services/api';
import { PackageTour } from '../../types/api';

export default function ExploreScreen() {
  const [packages, setPackages] = useState<PackageTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const colors = {
    background: isDarkMode ? '#000000' : '#f0f0f0',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    errorText: '#ff5252',
  };

  const fetchPackages = async () => {
    try {
      setError(null);
      const response = await api.get('/package-tours');
      setPackages(response.data);
    } catch (err) {
      console.error("Falha ao buscar pacotes:", err);
      setError('Não foi possível carregar os passeios. Tente novamente.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPackages();
  };

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.text} />
        <Text style={{ color: colors.text, marginTop: 10 }}>Carregando passeios...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.errorText }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Explorar Passeios' }} />
      <FlatList
        data={packages}
        renderItem={({ item }) => <TourPackageCard item={item} />}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text style={{ color: colors.text }}>Nenhum passeio encontrado no momento.</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.text} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
