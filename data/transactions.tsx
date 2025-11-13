// transactionStore.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { atom } from 'jotai';

// 🧠 Transaction Model
export type TransactionType = 'income' | 'expense'; // 'income' for money received, 'expense' for money spent
export type TransactionCategory = 'food' | 'entertainment' | 'party' | 'repaire' | 'buying' | 'salary' | 'others'; // category of the transaction

export interface Transaction {
  id: string; // unique identifier for the transaction
  amount: number; // monetary value of the transaction
  type: TransactionType; // whether it's income or expense
  category: TransactionCategory; // classification of the transaction
  date: string; // ISO string representing date and time of transaction
  description: string; // brief note or explanation about the transaction
}

// 🪙 Atom for state
export const transactionsAtom = atom<Transaction[]>([]);

// 🔁 AsyncStorage helpers
const TRANSACTIONS_KEY = 'transactions';

const loadTransactions = async (): Promise<Transaction[]> => {
  const data = await AsyncStorage.getItem(TRANSACTIONS_KEY);
  return data ? JSON.parse(data) : [];
};

const saveTransactions = async (transactions: Transaction[]) => {
  await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};

// 🔐 UUID generator using expo-crypto
const generateId = async (): Promise<string> => {
  return await Crypto.randomUUID();
};

// ➕ Create
export const createTransaction = async (
  newTx: Omit<Transaction, 'id'>
): Promise<Transaction[]> => {
  const existing = await loadTransactions();
  const id = await generateId();
  const transaction: Transaction = { id, ...newTx };
  const updated = [...existing, transaction];
  await saveTransactions(updated);
  return updated;
};

// 🔄 Update
export const updateTransaction = async (
  id: string,
  updatedTx: Partial<Transaction>
): Promise<Transaction[]> => {
  const existing = await loadTransactions();
  const updated = existing.map(tx => (tx.id === id ? { ...tx, ...updatedTx } : tx));
  await saveTransactions(updated);
  return updated;
};

// ❌ Delete
export const deleteTransaction = async (id: string): Promise<Transaction[]> => {
  const existing = await loadTransactions();
  const updated = existing.filter(tx => tx.id !== id);
  await saveTransactions(updated);
  return updated;
};

// 📥 Fetch All
export const fetchTransactions = async (): Promise<Transaction[]> => {
  return await loadTransactions();
};
