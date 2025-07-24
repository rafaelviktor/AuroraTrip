import PickerInput from '@/components/PickerInput';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import axios from 'axios';
import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';
import api from '../../services/api';
import { TouristPoint, Vehicle } from '../../types/api';

export default function CreatePackageScreen() {
    // Estados para os dados do formulário
    const [selectedVehicle, setSelectedVehicle] = useState<string | undefined>();
    const [selectedOrigin, setSelectedOrigin] = useState<string | undefined>();
    const [selectedDestination, setSelectedDestination] = useState<string | undefined>();
    const [departureTime, setDepartureTime] = useState(new Date());
    const [returnTime, setReturnTime] = useState(new Date());
    const [price, setPrice] = useState('');
    const [tourType, setTourType] = useState('aventura');

    // Estados para os dados da API
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [touristPoints, setTouristPoints] = useState<TouristPoint[]>([]);

    // Estados de controle da UI
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showPicker, setShowPicker] = useState<'departure' | 'return' | null>(null);

    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';
    const colors = {
        background: isDarkMode ? '#000000' : '#f0f0f0',
        cardBackground: isDarkMode ? '#2c2c2e' : '#FFFFFF',
        text: isDarkMode ? '#FFFFFF' : '#000000',
        inputBorder: isDarkMode ? '#555555' : 'gray',
        placeholder: isDarkMode ? '#AAAAAA' : '#8e8e8f',
        errorText: '#ff5252',
    };

    // Busca os dados iniciais (veículos e pontos turísticos)
    const fetchData = useCallback(async () => {
        try {
            const [vehiclesRes, pointsRes] = await Promise.all([
                api.get('/vehicles'),
                api.get('/tourist-points'),
            ]);
            setVehicles(vehiclesRes.data);
            setTouristPoints(pointsRes.data);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar os dados para o formulário.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Lógica para o DatePicker
    const onDateDepartureChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowPicker(null); // Esconde o picker
        if (selectedDate) {
            setDepartureTime(selectedDate);
        }
    };

    const onDateReturnChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowPicker(null); // Esconde o picker
        if (selectedDate) {
            setReturnTime(selectedDate);
        }
    };

    const handleSubmit = async () => {
        if (!selectedVehicle || !selectedOrigin || !selectedDestination || !price) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        setSubmitting(true);
        try {
            const apiData = {
                vehicle: selectedVehicle,
                origin: selectedOrigin,
                destination: selectedDestination,
                departureTime: departureTime.toISOString(), // Converte para o formato ZULU (UTC)
                returnTime: returnTime.toISOString(),
                price: parseFloat(price),
                tourType,
            };
            await api.post('/package-tours', apiData);
            Alert.alert('Sucesso', 'Novo pacote de tour criado!');
            router.back();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                Alert.alert('Falha ao Criar', error.response?.data?.message || 'Não foi possível criar o pacote.');
            } else {
                Alert.alert('Erro Inesperado', 'Ocorreu um erro.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const formFields = [
        { type: 'picker', key: 'vehicle', label: 'Veículo utilizado no passeio', items: vehicles.map(v => ({ label: `${v.vehicleModel} (${v.type})`, value: v._id })), value: selectedVehicle, setValue: setSelectedVehicle, zIndex: 5 },
        { type: 'picker', key: 'origin', label: 'Ponto de Partida', items: touristPoints.map(p => ({ label: p.name, value: p._id })), value: selectedOrigin, setValue: setSelectedOrigin, zIndex: 4 },
        { type: 'picker', key: 'destination', label: 'Ponto de Destino', items: touristPoints.map(p => ({ label: p.name, value: p._id })), value: selectedDestination, setValue: setSelectedDestination, zIndex: 3 },
        { type: 'picker', key: 'tourType', label: 'Tipo de Passeio', items: [{ label: 'Aventura', value: 'aventura' }, { label: 'Histórico', value: 'histórico' }], value: tourType, setValue: setTourType, zIndex: 2 },
        { type: 'datetime', key: 'departure', label: 'Data e Hora de Partida', value: departureTime, onChange: onDateDepartureChange },
        { type: 'datetime', key: 'return', label: 'Data e Hora de Retorno', value: returnTime, onChange: onDateReturnChange },
        { type: 'text', key: 'price', label: 'Preço (por pessoa)', value: price, setValue: setPrice, keyboardType: 'numeric' },
    ];

    if (loading) {
        return <ActivityIndicator style={{ flex: 1 }} size="large" />;
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{ title: 'Criar Novo Passeio' }} />
            <KeyboardAvoidingView
                style={{ flex: 1, backgroundColor: colors.background }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
            <View style={[styles.formContainer, { backgroundColor: colors.cardBackground }]}>
                {/* Seletor de Veículo */}
                <PickerInput
                    label="Veículo utilizado no passeio"
                    items={vehicles.map(v => ({ label: v.vehicleModel, value: v._id }))}
                    selectedValue={selectedVehicle}
                    onValueChange={(itemValue) => setSelectedVehicle(itemValue)}
                    placeholder='Selecione um veículo...'
                />

                {/* Seletor de Origem */}
                <PickerInput
                    label="Ponto de Partida"
                    items={touristPoints.map(v => ({ label: v.name, value: v._id }))}
                    selectedValue={selectedOrigin}
                    onValueChange={(itemValue) => setSelectedOrigin(itemValue)}
                    placeholder='Selecione uma origem...'
                />

                {/* Seletor de Destino */}
                <PickerInput
                    label="Ponto de Destino"
                    items={touristPoints.map(v => ({ label: v.name, value: v._id }))}
                    selectedValue={selectedDestination}
                    onValueChange={(itemValue) => setSelectedDestination(itemValue)}
                    placeholder='Selecione um destino...'
                />

                {/* Seletores de Data e Hora */}
                <Text style={[styles.label, { color: colors.text }]}>Data e Hora de Partida</Text>
                <DateTimePicker
                    value={departureTime}
                    mode="datetime"
                    display="default"
                    onChange={onDateDepartureChange}
                />
                <Text style={[styles.label, { color: colors.text }]}>Data e Hora de Retorno</Text>
                <DateTimePicker
                    value={returnTime}
                    mode="datetime"
                    display="default"
                    onChange={onDateReturnChange}
                />

                {/* Input de Preço */}
                <Text style={[styles.label, { color: colors.text }]}>Preço (por pessoa)</Text>
                <TextInput
                    style={[styles.input, { borderColor: colors.inputBorder, color: colors.text }]}
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                    placeholder="Ex: 150.00"
                />

                <Button title={submitting ? 'Criando...' : 'Criar Pacote'} onPress={handleSubmit} disabled={submitting} />
            </View>
            </KeyboardAvoidingView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    formContainer: { padding: 20, margin: 15, borderRadius: 10 },
    label: { fontSize: 16, marginBottom: 8, marginTop: 15 },
    input: { height: 40, borderWidth: 1, marginBottom: 20, paddingHorizontal: 10, borderRadius: 5 },
    dateText: { fontSize: 16, paddingVertical: 10, borderWidth: 1, borderColor: 'gray', paddingHorizontal: 10, borderRadius: 5 },
});
