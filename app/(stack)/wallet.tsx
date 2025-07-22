import { Stack } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, RefreshControl, StyleSheet, Text, useColorScheme, View } from 'react-native';
import TransactionItem from '../../components/TransactionItem';
import api from '../../services/api';
import { Transaction, Wallet } from '../../types/api';

export default function WalletScreen() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const colors = {
    background: isDarkMode ? '#000000' : '#f0f0f0',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    balanceText: isDarkMode ? '#4caf50' : '#2e7d32',
    errorText: '#ff5252',
    cardBackground: isDarkMode ? '#1c1c1e' : '#FFFFFF',
  };

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Busca o saldo e a primeira página de transações em paralelo
      const [walletResponse, transactionsResponse] = await Promise.all([
        api.get('/wallet'),
        api.get('/wallet/transactions?page=1&limit=10'),
      ]);

      setWallet(walletResponse.data);
      setTransactions(transactionsResponse.data.data);
      setCurrentPage(transactionsResponse.data.currentPage);
      setTotalPages(transactionsResponse.data.totalPages);
    } catch (err) {
      console.error("Falha ao buscar dados da carteira:", err);
      setError('Não foi possível carregar os dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const loadMoreTransactions = async () => {
    if (loadingMore || currentPage >= totalPages) return;

    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const response = await api.get(`/wallet/transactions?page=${nextPage}&limit=10`);
      // Adiciona as novas transações à lista existente
      setTransactions(prev => [...prev, ...response.data.data]);
      setCurrentPage(response.data.currentPage);
    } catch (err) {
      console.error("Falha ao carregar mais transações:", err);
      // Opcional: mostrar um alerta de erro
    } finally {
      setLoadingMore(false);
    }
  };

  const renderFooter = () => {
    if (loadingMore) {
      return <ActivityIndicator style={{ marginVertical: 20 }} />;
    }
    if (currentPage < totalPages) {
      return (
        <View style={styles.footer}>
          <Button title="Carregar mais" onPress={loadMoreTransactions} />
        </View>
      );
    }
    return null;
  };

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: colors.cardBackground }]}>
      <Text style={[styles.balanceLabel, { color: colors.text }]}>Saldo Atual</Text>
      <Text style={[styles.balanceAmount, { color: colors.balanceText }]}>
        {wallet ? `R$ ${wallet.balance.toFixed(2).replace('.', ',')}` : 'R$ 0,00'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.errorText }}>{error}</Text>
        <Button title="Tentar Novamente" onPress={fetchInitialData} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: 'Carteira' }} />
      <FlatList
        data={transactions}
        renderItem={({ item }) => <TransactionItem item={item} />}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.text }]}>Nenhuma movimentação encontrada.</Text>
        }
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchInitialData} tintColor={colors.text} />
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
  header: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  balanceLabel: {
    fontSize: 18,
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 5,
  },
  footer: {
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});
