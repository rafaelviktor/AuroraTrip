import React from 'react';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Vehicle } from '../types/api';
import { IconSymbol } from './ui/IconSymbol';

interface VehicleInfoCardProps {
  vehicle: Vehicle;
  onEdit: () => void;
  onDelete: () => void;
}

export default function VehicleInfoCard({ vehicle, onEdit, onDelete }: VehicleInfoCardProps) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const colors = {
    cardBackground: isDarkMode ? '#2c2c2e' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#b0b0b0' : '#666666',
    delete: isDarkMode ? '#ff453a' : '#ff3b30',
    edit: isDarkMode ? '#0A84FF' : '#007AFF',
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
      <View style={styles.infoContainer}>
        <Text style={[styles.model, { color: colors.text }]} numberOfLines={1} ellipsizeMode="tail">
          {vehicle.vehicleModel}
        </Text>
        <Text style={[styles.details, { color: colors.textSecondary }]}>
          Tipo: {vehicle.type} - Capacidade: {vehicle.capacity} pessoas
        </Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
          <IconSymbol name="pencil" size={24} color={colors.edit} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
          <IconSymbol name="trash" size={24} color={colors.delete} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingLeft: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
  },
  model: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 14,
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 10,
  },
});