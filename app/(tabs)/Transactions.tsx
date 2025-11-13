import { confirmDetails } from '@/atom/global';
import { ThemedText } from '@/components/themed-text';
import { ThemedTile } from '@/components/themed-tile';
import { ThemedView } from '@/components/themed-view';
import AppButton from '@/components/ui/appButton';
import { alerts } from '@/constants/messages';
import { Colors } from '@/constants/theme';
import type { Transaction } from '@/data/transactions';
import { deleteTransaction, fetchTransactions } from '@/data/transactions';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link, useFocusEffect, useNavigation } from 'expo-router';
import { useAtom } from 'jotai';
import React, { useCallback, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

const {height} = Dimensions.get('screen');

const TransactionListScreen = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const navigation = useNavigation();
  const [confirm, setConfirm] = useAtom(confirmDetails);
  useFocusEffect(useCallback(() => {
    const load = async () => {
      const txs = await fetchTransactions();
      setTransactions(txs.reverse());
    };
    load();
  }, []));

  const renderItem = ({ item }: { item: Transaction }) => (
    <ThemedTile style={styles.item}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: "space-between"
        }}
      >
      <View>
      <ThemedText
        type="title"
        style={[
          styles.amount,
          { color: item.type === 'expense' ? Colors.expense : Colors.income },
        ]}
      >
        ₹{item.amount.toFixed(2)} ({item.type})
      </ThemedText>
      <ThemedText style={styles.meta}>
        {item.category} • {new Date(item.date).toLocaleString()}
      </ThemedText>
      <ThemedText style={styles.description}>{item.description}</ThemedText> 
      </View>
      <View
        style={{
          alignItems: "center"
        }}
      >
        <AppButton type='cancel' onPress={
          () => handleDelete(item.id)
        } >
          <MaterialIcons name='delete' size={24} color={Colors.dark.text} />
        </AppButton>
      </View>
      </View>
    </ThemedTile>
  );
  
  async function onConfirm(prev : any, id : string){
    await deleteTransaction(id);
    const updated = await fetchTransactions();
    setTransactions(updated.reverse());
    setConfirm({ ...prev, visible: false });
  }

  const handleDelete = async (id: string) => {
    await setConfirm({
      type: "delete",
      message: alerts.deleteTransaction.message,
      title: alerts.deleteTransaction.Title,
      visible: true,
      onClose: (prev) => {
        setConfirm({ ...prev, visible: false });
      },
      onConfirm : (prev) => {
        onConfirm(prev, id);
      }
    })
  };


  const EmptyComponent = () => (
    <ThemedView style={styles.emptyWrapper}>
      <ThemedText type='subtitle' style={styles.emptyText}>There is no transaction recorded till now</ThemedText>
      <View style={{alignItems:"center"}}>
        <Link href={'/(tabs)/AddTransaction'} >
        <TouchableOpacity onPress={() => navigation.navigate('AddTransaction')}>
          <ThemedText type="default" style={{ color: Colors.primary }}>
            Tap here add one
          </ThemedText>
        </TouchableOpacity>
        </Link>
      </View>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={transactions}
        // data={[]} // testing validation
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={transactions.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={EmptyComponent}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  list: { paddingBottom: 20 },
  emptyList: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  item: { marginBottom: 12 },
  amount: { fontSize: 18, fontWeight: 'bold' },
  meta: { fontSize: 14, color: '#666', marginTop: 4 },
  description: { fontSize: 14, marginTop: 4 },
  emptyWrapper: { gap: 16, justifyContent: "flex-end" },
  emptyText: { fontSize: 16, textAlign: 'center' },
});

export default TransactionListScreen;
