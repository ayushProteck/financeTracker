// auth.ts
import { currentUser, storedUsers } from '@/atom/user';
import { alertMessage, user } from '@/constants/definations';
import { alerts } from '@/constants/messages';
import * as SecureStore from 'expo-secure-store';
import { getDefaultStore } from 'jotai';

const store = getDefaultStore();
const STORAGE_KEY = 'storedUsers';
const USER = "user";
export const signUpUser = async (email: string, password: string): Promise<{ success: boolean }> => {
  const users = store.get(storedUsers);
  const userExists = users.some(u => u.email === email);

  if (userExists) {
    return { success: false };
  }

  const newUser: user = { email, password };
  const updatedUsers = [...users, newUser];

  store.set(storedUsers, updatedUsers);
  await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(updatedUsers));

  return { success: true };
};

export const loginUser = async (
  email: string,
  password: string
): Promise<{ success: boolean; alertMessage: alertMessage | null }> => {
  const data = await SecureStore.getItemAsync(STORAGE_KEY);
  const users: user[] = data ? JSON.parse(data) : [];

  const user = users.find(u => u.email === email);

  if (!user) return { success: false, alertMessage: alerts.userNotFound };
  if (user.password !== password) return { success: false, alertMessage: alerts.wrongPassword };

  await SecureStore.setItemAsync(USER, JSON.stringify(user));
  store.set(currentUser, user);
  store.set(storedUsers, users);
  return { success: true, alertMessage: null };
};

export const getCurrentUser = async (): Promise<user | null> => {
  const data = await SecureStore.getItemAsync(USER);
  if (data) {
    const user: user = JSON.parse(data);
    store.set(currentUser, user);
    return user;
  }
  return null;
}

export const logoutUser = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(USER);
  store.set(currentUser, null);
}