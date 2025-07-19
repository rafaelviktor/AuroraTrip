import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

/**
 * Salva o access token e o refresh token de forma segura.
 */
export async function saveTokens(accessToken: string, refreshToken: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
  } catch (error) {
    console.error("Erro ao salvar os tokens no SecureStore", error);
    // Você pode querer lançar o erro ou lidar com ele de outra forma
  }
}

/**
 * Recupera o access token do armazenamento seguro.
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error("Erro ao recuperar o access token", error);
    return null;
  }
}

/**
 * Recupera o refresh token do armazenamento seguro.
 */
export async function getRefreshToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error("Erro ao recuperar o refresh token", error);
    return null;
  }
}

/**
 * Remove os tokens do armazenamento seguro (para logout).
 */
export async function clearTokens(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error("Erro ao limpar os tokens", error);
  }
}