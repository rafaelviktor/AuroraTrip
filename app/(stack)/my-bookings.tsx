import { Stack, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, useColorScheme, View } from 'react-native';
import BookingCard from '../../components/BookingCard';
import api from '../../services/api';
import { Booking } from '../../types/api';
import axios from 'axios';

export default function MyBookingsScreen() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const colors = {
        background: isDarkMode ? '#000000' : '#f0f0f0',
        text: isDarkMode ? '#FFFFFF' : '#000000',
        errorText: '#ff5252',
    };

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/bookings');
            setBookings(response.data);
        } catch (err) {
            console.error("Falha ao buscar reservas:", err);
            setError('Não foi possível carregar suas reservas.');
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchBookings();
        }, [])
    );

    const handleCancelBooking = (bookingId: string) => {
        Alert.alert(
            "Cancelar Reserva",
            "Tem certeza que deseja cancelar esta reserva? O valor será estornado para a sua carteira.",
            [
                { text: "Manter", style: "cancel" },
                {
                    text: "Confirmar Cancelamento",
                    onPress: async () => {
                        try {
                            // Chama a API para cancelar a reserva
                            await api.patch(`/bookings/${bookingId}/cancel`);
                            Alert.alert("Sucesso", "Sua reserva foi cancelada com sucesso.");
                            // Recarrega a lista para mostrar o status atualizado
                            fetchBookings();
                        } catch (err) {
                            if (axios.isAxiosError(err)) {
                                Alert.alert("Erro", err.response?.data?.message || "Não foi possível cancelar a reserva.");
                            } else {
                                Alert.alert("Erro", "Ocorreu um erro inesperado.");
                            }
                        }
                    },
                    style: "destructive", // Deixa o texto do botão vermelho no iOS
                },
            ]
        );
    };

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
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{ title: 'Minhas Reservas' }} />
            <FlatList
                data={bookings}
                renderItem={({ item }) => <BookingCard item={item} onCancel={() => handleCancelBooking(item._id)} />}
                keyExtractor={(item) => item._id}
                ListEmptyComponent={
                    <View style={styles.centerContainer}>
                        <Text style={{ color: colors.text }}>Você ainda não fez nenhuma reserva.</Text>
                    </View>
                }
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={fetchBookings} tintColor={colors.text} />
                }
                contentContainerStyle={{ paddingTop: 10 }}
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
        padding: 20,
    },
});
