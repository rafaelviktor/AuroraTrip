import React from 'react';
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { Booking } from '../types/api';

interface BookingCardProps {
  item: Booking;
  onCancel: () => void;
}

// Mapeia os status para textos e cores amigáveis
const statusConfig = {
  confirmed: { text: 'Confirmado', color: '#4caf50' }, // Verde
  in_progress: { text: 'Em Andamento', color: '#2196f3' }, // Azul
  completed: { text: 'Finalizado', color: '#607d8b' }, // Cinza
  canceled_by_user: { text: 'Cancelado', color: '#f44336' }, // Vermelho
  canceled_by_driver: { text: 'Cancelado', color: '#f44336' },
  pending_payment: { text: 'Pagamento Pendente', color: '#ff9800' }, // Laranja
};

export default function BookingCard({ item, onCancel }: BookingCardProps) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const colors = {
    cardBackground: isDarkMode ? '#2c2c2e' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#b0b0b0' : '#666666',
    cancelText: isDarkMode ? '#ff453a' : '#ff3b30',
  };

  const tourDate = new Date(item.packageTour.departureTime).toLocaleDateString('pt-BR');
  const currentStatus = statusConfig[item.status] || { text: item.status, color: colors.textSecondary };
  const canCancel = item.status === 'confirmed';

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
      <View style={styles.header}>
        <Text style={[styles.tourType, { color: colors.text }]}>
          Passeio de {item.packageTour.tourType}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: currentStatus.color }]}>
          <Text style={styles.statusText}>{currentStatus.text}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={[styles.detail, { color: colors.textSecondary }]}>
          Motorista: {item.driver.name}
        </Text>
        <Text style={[styles.detail, { color: colors.textSecondary }]}>
          Data: {tourDate}
        </Text>
        <Text style={[styles.detail, { color: colors.textSecondary }]}>
          {item.seats} assento(s) - R$ {item.totalPrice.toFixed(2).replace('.', ',')}
        </Text>
      </View>

      {canCancel && (
        <View style={styles.footer}>
          <TouchableOpacity onPress={onCancel}>
            <Text style={[styles.cancelText, { color: colors.cancelText }]}>Cancelar Reserva</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    paddingBottom: 10,
    marginBottom: 10,
  },
  tourType: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  body: {},
  detail: {
    fontSize: 14,
    lineHeight: 22,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#444',
    paddingTop: 10,
    marginTop: 10,
    alignItems: 'flex-end',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
