import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Button, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import ProfileInfoRow from '../../components/ProfileInfoRow'; // Reutilizando o componente
import { PackageTour } from '../../types/api';

export default function PackageDetailsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  // 1. Recebe e converte os dados do pacote de forma segura
  const packageData = useMemo(() => {
    if (params.packageData) {
      try {
        return JSON.parse(params.packageData as string) as PackageTour;
      } catch (e) {
        return null;
      }
    }
    return null;
  }, [params.packageData]);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const colors = {
    background: isDarkMode ? '#000000' : '#f0f0f0',
    cardBackground: isDarkMode ? '#1c1c1e' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#b0b0b0' : '#666666',
    priceText: isDarkMode ? '#4caf50' : '#2e7d32',
  };

  if (!packageData) {
    return (
      <View style={styles.centerContainer}>
        <Text>Erro ao carregar os detalhes do pacote.</Text>
      </View>
    );
  }
  
  const departureDateTime = new Date(packageData.departureTime).toLocaleString('pt-BR');
  const returnDateTime = new Date(packageData.returnTime).toLocaleString('pt-BR');

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: packageData.tourType.charAt(0).toUpperCase() + packageData.tourType.slice(1) }} />
      
      <View style={styles.imagePlaceholder} />

      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: colors.text }]}>
          {packageData.origin.name} para {packageData.destination.name}
        </Text>
        
        <View style={[styles.infoBox, { backgroundColor: colors.cardBackground }]}>
          <ProfileInfoRow label="Motorista" value={packageData.driver.name} />
          <ProfileInfoRow label="Veículo" value={`${packageData.vehicle.vehicleModel} (${packageData.driver.transportType})`} />
          <ProfileInfoRow label="Partida" value={departureDateTime} />
          <ProfileInfoRow label="Retorno" value={returnDateTime} />
          <ProfileInfoRow label="Vagas restantes" value={`${packageData.seatsAvailable}`} />
          <ProfileInfoRow label="Preço por pessoa" value={`R$ ${packageData.price.toFixed(2).replace('.', ',')}`} isLast />
        </View>

        <View style={styles.bookingContainer}>
          <Button 
            title="Reservar Agora" 
            onPress={() => {
              // Navega para a tela de reserva, passando o ID do pacote
              router.push({
                pathname: '/create-booking', 
                params: {
                  packageId: packageData._id,
                  packagePrice: packageData.price,
                  seatsAvailable: packageData.seatsAvailable,
                  tourTitle: `${packageData.origin.name} para ${packageData.destination.name}`
                } 
              });
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imagePlaceholder: { height: 250, backgroundColor: '#ccc' },
  contentContainer: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  infoBox: { borderRadius: 10, paddingHorizontal: 15, marginBottom: 30 },
  bookingContainer: { marginBottom: 30 },
});
