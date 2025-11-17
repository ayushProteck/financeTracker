import DailyExpenseLineChart from "@/components/charts/DailyExpenseLineChart";
import MonthlyExpensePieChart from "@/components/charts/MonthlyExpensePieChart";
import MonthlyIncomeExpenseBarChart from "@/components/charts/MonthlyIncomeExpenseBarChart";

import MonthlySummary from "@/components/MonthlySummary";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import AppButton from "@/components/ui/appButton";
import { fetchTransactions } from "@/data/transactions";
import { useThemeColor } from "@/hooks/use-theme-color";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

interface Transaction {
  id: string;
  amount: number;
  date: string;
  type: "income" | "expense";
  category: string;
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const textColor = useThemeColor({ light: undefined, dark: undefined }, "text");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const txs = await fetchTransactions();
        setTransactions(txs);

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const filtered = txs.filter(tx => {
          const txDate = new Date(tx.date);
          return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
        });

        const income = filtered
          .filter(tx => tx.type === "income")
          .reduce((sum, tx) => sum + tx.amount, 0);

        const expense = filtered
          .filter(tx => tx.type === "expense")
          .reduce((sum, tx) => sum + tx.amount, 0);

        setIncomeTotal(income);
        setExpenseTotal(expense);
      };

      load();
    }, [])
  );

  return (
    <ThemedView style={styles.container}>
      
        <View style={styles.header}>
          <ThemedText type="default">Summary</ThemedText>
          <AppButton
            type="primary"
            onPress={() => navigation.navigate("AddTransaction")}
          >
            <MaterialIcons name="add-circle-outline" size={14} color={"#fff"} />
          </AppButton>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
        <MonthlySummary incomeTotal={incomeTotal} expenseTotal={expenseTotal} />

        <DailyExpenseLineChart transactions={transactions} />
        <MonthlyExpensePieChart transactions={transactions} />
        <MonthlyIncomeExpenseBarChart transactions={transactions} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 12,
  },
});
