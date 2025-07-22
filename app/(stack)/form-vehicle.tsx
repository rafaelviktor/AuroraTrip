import { Vehicle } from '@/types/api';
import axios from 'axios';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';
import api from '../../services/api';

export default function AddVehicleScreen() {
  const params = useLocalSearchParams();
  const vehicleToEdit = params.vehicle ? JSON.parse(params.vehicle as string) as Vehicle : null;
  const isEditing = !!vehicleToEdit;

  const [vehicleModel, setVehicleModel] = useState(vehicleToEdit?.vehicleModel || '');
  const [capacity, setCapacity] = useState(vehicleToEdit?.capacity.toString() || '');
  const [type, setType] = useState<'buggy' | 'lancha' | '4x4'>((vehicleToEdit?.type as 'buggy' | 'lancha' | '4x4') || 'buggy');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const colors = {
    background: isDarkMode ? '#000000' : '#f0f0f0',
    cardBackground: isDarkMode ? '#1c1c1e' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    inputBorder: isDarkMode ? '#555555' : 'gray',
    placeholder: isDarkMode ? '#AAAAAA' : '#8e8e8f',
    primary: '#007AFF',
  };

  const handleSubmit = async () => {
    if (!vehicleModel || !capacity) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    const vehicleData = {
      type,
      vehicleModel,
      capacity: parseInt(capacity.replace(/[^0-9]/g, ''), 10),
    };

    try {
      if (isEditing) {
        await api.patch(`/vehicles/${vehicleToEdit?._id}`, vehicleData);
        Alert.alert('Sucesso', 'Veículo atualizado com sucesso!');
      } else {
        await api.post('/vehicles', vehicleData);
        Alert.alert('Sucesso', 'Veículo adicionado com sucesso!');
      }
      router.back();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const action = isEditing ? 'atualizar' : 'adicionar';
        Alert.alert(`Falha ao ${action}`, error.response?.data?.message || 'Não foi possível adicionar o veículo.');
      } else {
        Alert.alert('Erro Inesperado', 'Ocorreu um erro. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: isEditing ? 'Editar Veículo' : 'Adicionar Novo Veículo' }} />
      
      <View style={[styles.formContainer, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.label, { color: colors.text }]}>Modelo do Veículo</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.inputBorder, color: colors.text }]}
          placeholder="Ex: Toyota Hilux"
          value={vehicleModel}
          onChangeText={setVehicleModel}
          placeholderTextColor={colors.placeholder}
        />

        <Text style={[styles.label, { color: colors.text }]}>Capacidade de Passageiros</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.inputBorder, color: colors.text }]}
          placeholder="Ex: 4"
          value={capacity}
          onChangeText={(text) => setCapacity(text.replace(/[^0-9]/g, ''))}
          keyboardType="number-pad"
          placeholderTextColor={colors.placeholder}
        />

        <Text style={[styles.label, { color: colors.text }]}>Tipo de Veículo</Text>
        <View style={styles.switchContainer}>
          <Button title="Buggy" onPress={() => setType('buggy')} color={type === 'buggy' ? colors.primary : 'gray'} />
          <Button title="Lancha" onPress={() => setType('lancha')} color={type === 'lancha' ? colors.primary : 'gray'} />
          <Button title="4x4" onPress={() => setType('4x4')} color={type === '4x4' ? colors.primary : 'gray'} />
        </View>

        <Button 
          title={loading ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Adicionar Veículo')} 
          onPress={handleSubmit} 
          disabled={loading} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  formContainer: {
    padding: 20,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
    marginTop: 10,
  },
});
