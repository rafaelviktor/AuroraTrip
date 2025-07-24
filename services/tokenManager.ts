import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_ROLE_KEY = 'userRole';

/**
 * Salva o access token, refresh token e o role de forma segura.
 */
export async function saveTokens(accessToken: string, refreshToken: string, role?: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);

    if (role) {
      await SecureStore.setItemAsync(USER_ROLE_KEY, role);
    }
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
 * Recupera o papel do usuário do armazenamento seguro.
 */
export async function getUserRole(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(USER_ROLE_KEY);
  } catch (error) {
    console.error("Erro ao recuperar o user role", error);
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
    await SecureStore.deleteItemAsync(USER_ROLE_KEY);
  } catch (error) {
    console.error("Erro ao limpar os tokens", error);
  }
}