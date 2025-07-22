import React from 'react';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import { Transaction } from '../types/api';

interface TransactionItemProps {
  item: Transaction;
}

// Mapeia os tipos de transação para textos amigáveis
const transactionTypeLabels: { [key: string]: string } = {
  deposit: 'Depósito na Plataforma',
  withdraw: 'Resgate da Plataforma',
  booking_payment: 'Pagamento de Reserva',
  tour_payout_hold: 'Pagamento Retido',
  tour_payout: 'Recebimento por Passeio',
  fee_collection: 'Taxa da Plataforma',
  hold_refund: 'Reembolso de Reserva',
  refund: 'Reembolso Recebido',
};

export default function TransactionItem({ item }: TransactionItemProps) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const isCredit = item.amount > 0;

  const colors = {
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#b0b0b0' : '#666666',
    credit: isDarkMode ? '#4caf50' : '#2e7d32', // Verde
    debit: isDarkMode ? '#f44336' : '#c62828',   // Vermelho
    border: isDarkMode ? '#3a3a3c' : '#e0e0e0',
  };

  const formattedAmount = `${isCredit ? '+' : ''} R$ ${Math.abs(item.amount).toFixed(2).replace('.', ',')}`;
  const transactionDate = new Date(item.createdAt).toLocaleDateString('pt-BR');
  const transactionTime = new Date(item.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <View style={styles.details}>
        <Text style={[styles.type, { color: colors.text }]}>
          {transactionTypeLabels[item.type] || item.type}
        </Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {item.metadata?.description || `Transação #${item._id.substring(0, 8)}`}
        </Text>
        <Text style={[styles.date, { color: colors.textSecondary }]}>
          {transactionDate} às {transactionTime}
        </Text>
      </View>
      <Text style={[styles.amount, { color: isCredit ? colors.credit : colors.debit }]}>
        {formattedAmount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  details: {
    flex: 1,
    marginRight: 10,
  },
  type: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    marginTop: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});