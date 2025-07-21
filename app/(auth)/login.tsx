import { saveTokens } from '@/services/tokenManager';
import axios from 'axios';
import { Link, Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';
import api from '../../services/api';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'user' | 'driver'>('user');
  const router = useRouter();

  const colorScheme = useColorScheme();

  const isDarkMode = colorScheme === 'dark';
  const colors = {
    background: isDarkMode ? '#121212' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    inputBorder: isDarkMode ? '#555555' : 'gray',
    placeholder: isDarkMode ? '#AAAAAA' : '#8e8e8f',
    link: '#007AFF',
  };

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      const response = await api.post('/auth/login', {
        type: userType,
        username: username,
        password: password,
      });

      const { access_token, refresh_token } = response.data;

      if (access_token && refresh_token) {
        await saveTokens(access_token, refresh_token);

        console.log('Tokens salvos com sucesso!');
        Alert.alert('Sucesso', 'Login realizado com sucesso!');

        // Navega para a tela principal do app após o login
        router.dismissTo('/(tabs)');
      } else {
        // Caso a API não retorne os tokens esperados
        throw new Error('Tokens não recebidos na resposta do login.');
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Falha no login (Axios Error):', error.response?.data || error.message);
        Alert.alert('Falha no Login', error.response?.data?.message || 'Usuário ou senha incorretos.');
      } else {
        console.error('Falha no login (Erro inesperado):', error);
        Alert.alert('Erro Inesperado', 'Ocorreu um erro. Tente novamente.');
      }
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Login' }} />
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.background }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
        >
          <Text style={[styles.title, { color: colors.text }]}>Login - AuroraTrip</Text>

          <View style={styles.switchContainer}>
            <Button title="Sou Usuário" onPress={() => setUserType('user')} color={userType === 'user' ? '#007AFF' : 'gray'} />
            <Button title="Sou Motorista" onPress={() => setUserType('driver')} color={userType === 'driver' ? '#007AFF' : 'gray'} />
          </View>

          <TextInput
            style={[styles.input, { borderColor: colors.inputBorder, color: colors.text }]}
            placeholder="Email ou nome de usuário"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
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
          <Button title="Entrar" onPress={handleLogin} />

          <View style={styles.linksContainer}>
            <Link href="/(auth)/register-user" style={[styles.link, { color: colors.link }]}>
              Não tem conta? Cadastre-se como usuário
            </Link>
            <Link href="/(auth)/register-driver" style={[styles.link, { color: colors.link }]}>
              Seja um motorista parceiro
            </Link>
          </View>
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
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 5
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20
  },
  linksContainer: {
    marginTop: 20,
    alignItems: 'center'
  },
  link: {
    marginTop: 15
  },
});