import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { Transaction } from '@/data/transactions';
import { fetchTransactions } from '@/data/transactions';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-gifted-charts';

const TransactionCharts = () => {
  const [expenseData, setExpenseData] = useState<{ value: number; label: string }[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<{ label: string; value: number }[]>([]);
  const [monthlyData, setMonthlyData] = useState<{ label: string; income: number; expense: number }[]>([]);
  const [hasData, setHasData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textColor = useThemeColor({ light: undefined, dark: undefined }, 'text');

  useEffect(() => {
    const load = async () => {
      try {
        const txs: Transaction[] = await fetchTransactions();

        if (!txs || txs.length === 0) {
          setHasData(false);
          return;
        }

        setHasData(true);

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        // --- Daily expense line chart data ---
        const expenseTotals: Record<string, number> = {};
        txs.forEach(tx => {
          const txDate = new Date(tx.date);
          if (txDate.getFullYear() === currentYear && txDate.getMonth() === currentMonth) {
            const day = txDate.getDate().toString();
            if (tx.type === 'expense') {
              expenseTotals[day] = (expenseTotals[day] || 0) + tx.amount;
            }
          }
        });

        setExpenseData(
          Object.entries(expenseTotals).map(([day, total]) => ({
            value: total,
            label: day,
          }))
        );

        // --- Expense pie chart data (only current month) ---
        const categoryTotals: Record<string, number> = {};
        txs.forEach(tx => {
          const txDate = new Date(tx.date);
          if (tx.type === 'expense' && txDate.getFullYear() === currentYear && txDate.getMonth() === currentMonth) {
            categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
          }
        });
        setExpenseCategories(Object.entries(categoryTotals).map(([label, value]) => ({ label, value })));

        // --- Monthly income & expense totals (whole year) ---
        const monthlyTotals: Record<number, { income: number; expense: number }> = {};
        txs.forEach(tx => {
          const txDate = new Date(tx.date);
          if (txDate.getFullYear() === currentYear) {
            const month = txDate.getMonth();
            if (!monthlyTotals[month]) monthlyTotals[month] = { income: 0, expense: 0 };
            if (tx.type === 'income') {
              monthlyTotals[month].income += tx.amount;
            } else {
              monthlyTotals[month].expense += tx.amount;
            }
          }
        });

        const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const monthlyDataArr = Object.entries(monthlyTotals).map(([month, totals]) => ({
          label: monthLabels[parseInt(month)],
          income: totals.income,
          expense: totals.expense,
        }));

        setMonthlyData(monthlyDataArr);
      } catch (err: any) {
        setError('Failed to load transactions. Please try again later.');
        console.error(err);
      }
    };

    load();
  }, []);

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle" style={styles.message}>{error}</ThemedText>
      </ThemedView>
    );
  }

  if (!hasData) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle" style={styles.message}>
          No transaction data available yet. Add some transactions to see charts.
        </ThemedText>
      </ThemedView>
    );
  }

  // --- Format monthlyData into alternating income/expense bars ---
  const chartData = monthlyData.flatMap(m => [
    {
      value: m.income,
      frontColor: '#006DFF',
      gradientColor: '#009FFF',
      spacing: 6,
      label: m.label, // show month label only on income bar
    },
    {
      value: m.expense,
      frontColor: '#3BE9DE',
      gradientColor: '#93FCF8',
    },
  ]);

  return (
    <ScrollView style={styles.container}>
      {/* Daily Expense Line Chart */}
      <ThemedText type="title" style={styles.heading}>Daily Expenses (This Month)</ThemedText>
      <LineChart
        data={expenseData}
        color="red"
        thickness={3}
        hideDataPoints={false}
        dataPointsColor="red"
        curved
        yAxisTextStyle={{ color: textColor }}
        xAxisLabelTextStyle={{ color: textColor }}
        xAxisColor={textColor}
        yAxisColor={textColor}
      />

      {/* Expense Pie Chart (only current month) */}
      <ThemedText type="title" style={[styles.heading, { marginTop: 24 }]}>Expense Breakdown (This Month)</ThemedText>
      <PieChart
        data={expenseCategories.map(cat => ({
          value: cat.value,
          text: cat.label,
        }))}
        donut
        showText
        textColor="black"
        radius={120}
        innerRadius={60}
      />

      {/* Monthly Income & Expense Bar Chart */}
      <ThemedText type="title" style={[styles.heading, { marginTop: 24 }]}>Monthly Income & Expenses (This Year)</ThemedText>
      <BarChart
        data={chartData}
        barWidth={30}
        spacing={20}
        hideRules
        xAxisThickness={1}
        yAxisThickness={1}
        yAxisTextStyle={{ color: textColor }}
        xAxisLabelTextStyle={{ color: textColor }}
        xAxisColor={textColor}
        yAxisColor={textColor}
        showValuesAsTopLabel
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingBottom: 20 },
  heading: { marginBottom: 12, fontWeight: 'bold', fontSize: 18 },
  message: { textAlign: 'center', marginTop: 40, fontSize: 16 },
});

export default TransactionCharts;
