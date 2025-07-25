import React from 'react';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { PackageTour } from '../types/api';

interface TourPackageCardProps {
  item: PackageTour;
  onPress: () => void;
}

export default function TourPackageCard({ item, onPress }: TourPackageCardProps) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const colors = {
    cardBackground: isDarkMode ? '#2c2c2e' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#b0b0b0' : '#666666',
    priceText: isDarkMode ? '#4caf50' : '#2e7d32',
    imagePlaceholder: isDarkMode ? '#3a3a3c' : '#e0e0e0',
  };

  const departureDate = new Date(item.departureTime).toLocaleDateString('pt-BR');

  return (
    <TouchableOpacity onPress={onPress} style={[styles.card, { backgroundColor: colors.cardBackground }]}>
      <View style={[styles.imagePlaceholder, { backgroundColor: colors.imagePlaceholder }]}>
        <Text style={{ color: colors.textSecondary }}>Imagem do Passeio</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          {item.origin.name} para {item.destination.name}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          com {item.driver.name} em um(a) {item.driver.transportType}
        </Text>

        <View style={styles.detailsRow}>
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            Data: {departureDate}
          </Text>
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
            Vagas: {item.seatsAvailable}
          </Text>
        </View>

        <Text style={[styles.price, { color: colors.priceText }]}>
          R$ {item.price.toFixed(2).replace('.', ',')} por pessoa
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginVertical: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
});