import axios from 'axios';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { IconSymbol } from '../../components/ui/IconSymbol';
import api from '../../services/api';

export default function CreateBookingScreen() {
  // 1. Recebe os parâmetros da tela anterior
  const params = useLocalSearchParams();
  const router = useRouter();
  
  const packageId = params.packageId as string;
  const packagePrice = parseFloat(params.packagePrice as string || '0');
  const seatsAvailable = parseInt(params.seatsAvailable as string || '0', 10);
  const tourTitle = params.tourTitle as string || 'Detalhes da Reserva';

  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const colors = {
    background: isDarkMode ? '#000000' : '#f0f0f0',
    cardBackground: isDarkMode ? '#1c1c1e' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#b0b0b0' : '#666666',
    primary: '#007AFF',
  };

  // 2. Calcula o preço total dinamicamente
  const totalPrice = useMemo(() => seats * packagePrice, [seats, packagePrice]);

  const handleSeatChange = (amount: number) => {
    const newSeats = seats + amount;
    if (newSeats >= 1 && newSeats <= seatsAvailable) {
      setSeats(newSeats);
    }
  };

  const handleBooking = async () => {
    setLoading(true);
    try {
      await api.post('/bookings', {
        packageTourId: packageId,
        seats: seats,
      });
      Alert.alert(
        'Reserva Confirmada!',
        'Sua reserva foi realizada com sucesso. Você pode ver os detalhes na sua área de perfil.',
        [{ text: 'OK', onPress: () => router.push('/(home)/profile') }]
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Alert.alert('Falha na Reserva', error.response?.data?.message || 'Não foi possível completar a reserva.');
      } else {
        Alert.alert('Erro Inesperado', 'Ocorreu um erro.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Confirmar Reserva' }} />
      
      <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.title, { color: colors.text }]}>{tourTitle}</Text>
        
        <Text style={[styles.label, { color: colors.textSecondary }]}>Quantidade de Assentos</Text>
        <View style={styles.stepperContainer}>
          <TouchableOpacity onPress={() => handleSeatChange(-1)} disabled={seats <= 1} style={styles.stepperButton}>
            <IconSymbol name="minus.circle" size={32} color={seats <= 1 ? '#555' : colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.seatsText, { color: colors.text }]}>{seats}</Text>
          <TouchableOpacity onPress={() => handleSeatChange(1)} disabled={seats >= seatsAvailable} style={styles.stepperButton}>
            <IconSymbol name="plus.circle" size={32} color={seats >= seatsAvailable ? '#555' : colors.primary} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.availableText, { color: colors.textSecondary }]}>
          ({seatsAvailable} vagas disponíveis)
        </Text>

        <View style={styles.priceContainer}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Valor Total</Text>
          <Text style={[styles.totalPrice, { color: colors.text }]}>
            R$ {totalPrice.toFixed(2).replace('.', ',')}
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button 
          title={loading ? 'Processando...' : 'Confirmar e Pagar'} 
          onPress={handleBooking} 
          disabled={loading || seatsAvailable === 0}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  card: {
    padding: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  stepperButton: {
    padding: 10,
  },
  seatsText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginHorizontal: 30,
    minWidth: 50,
    textAlign: 'center',
  },
  availableText: {
    textAlign: 'center',
    marginBottom: 30,
  },
  priceContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderColor: '#555',
  },
  totalPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    paddingBottom: 20,
  },
});
