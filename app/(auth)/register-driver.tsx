import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View, useColorScheme } from 'react-native';
import api from '../../services/api';

export default function RegisterDriverScreen() {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [transportType, setTransportType] = useState<'buggy' | 'lancha' | '4x4'>('buggy');
  const router = useRouter();

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const colors = {
    background: isDarkMode ? '#121212' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    inputBorder: isDarkMode ? '#555555' : 'gray',
    placeholder: isDarkMode ? '#AAAAAA' : '#8e8e8f',
    primary: '#007AFF',
  };

  const handleRegister = async () => {
    try {
      await api.post('/drivers', {
        username,
        name,
        email,
        phone,
        password,
        transportType,
      });
      Alert.alert('Sucesso', 'Motorista cadastrado com sucesso! Faça o login para continuar.');
      router.push('/(auth)/login');
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Falha no cadastro:', error.response?.data || error.message);
            Alert.alert('Falha no Cadastro', error.response?.data?.message || 'Não foi possível realizar o cadastro.');
        } else {
            console.error('Falha no cadastro (Erro inesperado):', error);
            Alert.alert('Erro Inesperado', 'Ocorreu um erro. Tente novamente.');
        }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      <Text style={[styles.title, { color: colors.text }]}>Cadastro de Motorista</Text>

      <TextInput
        style={[styles.input, { borderColor: colors.inputBorder, color: colors.text }]}
        placeholder="Nome de usuário"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor={colors.placeholder}
      />
      <TextInput
        style={[styles.input, { borderColor: colors.inputBorder, color: colors.text }]}
        placeholder="Nome Completo"
        value={name}
        onChangeText={setName}
        placeholderTextColor={colors.placeholder}
      />
      <TextInput
        style={[styles.input, { borderColor: colors.inputBorder, color: colors.text }]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={colors.placeholder}
      />
      <TextInput
        style={[styles.input, { borderColor: colors.inputBorder, color: colors.text }]}
        placeholder="Telefone (com DDD)"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholderTextColor={colors.placeholder}
      />
      <TextInput
        style={[styles.input, { borderColor: colors.inputBorder, color: colors.text }]}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={colors.placeholder}
      />
      
      <Text style={[styles.label, { color: colors.text }]}>Principal tipo de transporte:</Text>
      <View style={styles.switchContainer}>
        <Button title="Buggy" onPress={() => setTransportType('buggy')} color={transportType === 'buggy' ? colors.primary : 'gray'} />
        <Button title="Lancha" onPress={() => setTransportType('lancha')} color={transportType === 'lancha' ? colors.primary : 'gray'} />
        <Button title="4x4" onPress={() => setTransportType('4x4')} color={transportType === '4x4' ? colors.primary : 'gray'} />
      </View>

      <Button title="Cadastrar" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 20 
  },
  input: { 
    height: 40, 
    borderWidth: 1, 
    marginBottom: 12, 
    paddingHorizontal: 10, 
    borderRadius: 5 
  },
  label: { 
    fontSize: 16, 
    marginBottom: 10, 
    marginTop: 10 
  },
  switchContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginBottom: 20 
  },
});