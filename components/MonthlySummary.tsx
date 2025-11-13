// MonthlySummary.tsx

import { ThemedText } from '@/components/themed-text';
import { ThemedTile } from '@/components/themed-tile';
import { Colors } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export type MonthlySummaryProps = {
  incomeTotal : number,
  expenseTotal : number
}

const MonthlySummary = ( {incomeTotal, expenseTotal} : MonthlySummaryProps ) => {
  // const [incomeTotal, setIncomeTotal] = useState(0);
  // const [expenseTotal, setExpenseTotal] = useState(0);
  // useEffect(() => {
  //   const load = async () => {
  //     const txs = await fetchTransactions();
  //     const now = new Date();
  //     const currentMonth = now.getMonth();
  //     const currentYear = now.getFullYear();

  //     const filtered = txs.filter(tx => {
  //       const txDate = new Date(tx.date);
  //       return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
  //     });

  //     const income = filtered
  //       .filter(tx => tx.type === 'income')
  //       .reduce((sum, tx) => sum + tx.amount, 0);

  //     const expense = filtered
  //       .filter(tx => tx.type === 'expense')
  //       .reduce((sum, tx) => sum + tx.amount, 0);

  //     setIncomeTotal(income);
  //     setExpenseTotal(expense);
  //   };

  //   load();
  // }, []);
  console.log("Income this month", incomeTotal);
  console.log("expence this month", expenseTotal);
  return (
    <ThemedTile style={styles.container}>
      {(incomeTotal || expenseTotal) ? 
        <View>
          <ThemedText type='title' style={styles.income}>Income: {
          incomeTotal || incomeTotal != 0 ? "₹" + incomeTotal.toFixed(2) : "No salary added this month"
          }</ThemedText>
          <ThemedText type='title' style={styles.expense}>Expenses: {
          expenseTotal || expenseTotal != 0 ? "₹" + expenseTotal.toFixed(2) : "No expence recorded this month"
          }</ThemedText>
        </View> : <ThemedText
          type='defaultSemiBold'
        >
          Their is no transaction recorded this month.
        </ThemedText>
      }

    </ThemedTile>
  );
};

const styles = StyleSheet.create({
  container: { margin: 16, padding: 16 },
  heading: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  income: { color: Colors.income, fontSize: 16, marginBottom: 4 },
  expense: { color: Colors.expense, fontSize: 16,  },
});

export default MonthlySummary;
