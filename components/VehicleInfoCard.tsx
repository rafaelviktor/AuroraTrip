import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Vehicle } from '../types/api';

interface VehicleInfoCardProps {
  vehicle: Vehicle;
}

export default function VehicleInfoCard({ vehicle }: VehicleInfoCardProps) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const colors = {
    cardBackground: isDarkMode ? '#2c2c2e' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#b0b0b0' : '#666666',
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
      <Text style={[styles.model, { color: colors.text }]}>{vehicle.vehicleModel}</Text>
      <Text style={[styles.details, { color: colors.textSecondary }]}>
        Tipo: {vehicle.type} - Capacidade: {vehicle.capacity} pessoas
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  model: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 14,
    marginTop: 4,
  },
});