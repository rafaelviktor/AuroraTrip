import axios from 'axios';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, useColorScheme } from 'react-native';
import api from '../../services/api';

export default function RegisterUserScreen() {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
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
      await api.post('/users', {
        username,
        name,
        email,
        phone,
        password,
      });
      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso! Faça o login para continuar.');
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
    <>
      <Stack.Screen options={{ title: 'Registrar usuário' }} />
            <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.background }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
        >
        <Text style={[styles.title, { color: colors.text }]}>Cadastro de Usuário</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.inputBorder, color: colors.text }]}
          placeholder="Nome de usuário" value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={[styles.input, { borderColor: colors.inputBorder, color: colors.text }]}
          placeholder="Nome Completo"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[styles.input, { borderColor: colors.inputBorder, color: colors.text }]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={[styles.input, { borderColor: colors.inputBorder, color: colors.text }]}
          placeholder="Telefone (com DDD)"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={[styles.input, { borderColor: colors.inputBorder, color: colors.text }]}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="Cadastrar" onPress={handleRegister} />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
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
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 5
  },
});