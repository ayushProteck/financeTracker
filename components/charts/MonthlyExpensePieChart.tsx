import { ThemedText } from '@/components/themed-text';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

interface Transaction {
  id: string;
  amount: number;
  date: string; // ISO string
  type: 'income' | 'expense';
  category: string;
}

interface Props {
  transactions?: Transaction[];
}

const colors = [
  '#006DFF',
  '#3BE9DE',
  '#FF6B6B',
  '#FFD93D',
  '#6BCB77',
  '#4D96FF',
  '#9D4EDD',
  '#FF9F1C',
]; // extend as needed

const MonthlyExpensePieChart: React.FC<Props> = ({ transactions = [] }) => {
  const hasData = Array.isArray(transactions) && transactions.length > 0;

  // Compute expense totals by category for current month
  const expenseCategories = useMemo(() => {
    if (!hasData) return [];

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const categoryTotals: Record<string, number> = {};
    transactions.forEach(tx => {
      const txDate = new Date(tx.date);
      if (
        tx.type === 'expense' &&
        txDate.getMonth() === currentMonth &&
        txDate.getFullYear() === currentYear
      ) {
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
      }
    });

    const total = Object.values(categoryTotals).reduce((sum, v) => sum + v, 0);

    return Object.entries(categoryTotals)
      .map(([label, value]) => ({
        label,
        value,
        percentage: total > 0 ? ((value / total) * 100).toFixed(1) : '0',
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, hasData]);

  const hasCategories = expenseCategories.length > 0;

  return (
    <View style={styles.section}>
      <ThemedText type="title" style={[styles.heading, { marginTop: 24 }]}>
        Expense Breakdown (This Month)
      </ThemedText>

      {!hasCategories ? (
        <ThemedText type="subtitle" style={styles.message}>
          No category data available for this month.
        </ThemedText>
      ) : (
        <>
          <PieChart
            data={expenseCategories.map((cat, index) => ({
              value: cat.value,
              color: colors[index % colors.length],
              text: `${cat.percentage}%`, // percentage inside slice
            }))}
            donut
            isAnimated
            showText={true} // show text inside chart
            textColor="black"
            textSize={12}
            radius={120}
            innerRadius={50}
            showValuesAsTooltipText={true}
          />

          {/* Legend (color index) */}
          <View style={styles.legendContainer}>
            {expenseCategories.map((cat, index) => (
              <View key={index} style={styles.legendItem}>
                <View
                  style={[
                    styles.colorBox,
                    { backgroundColor: colors[index % colors.length] },
                  ]}
                />
                <ThemedText type="default" style={styles.legendText}>
                  {cat.label}
                </ThemedText>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: { margin: 16, alignItems: 'center' },
  heading: { marginBottom: 12, fontWeight: 'bold', fontSize: 18 },
  message: { textAlign: 'center', marginTop: 8, fontSize: 14 },
  legendContainer: { marginTop: 16, width: '100%' },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  colorBox: { width: 16, height: 16, marginRight: 8, borderRadius: 4 },
  legendText: { fontSize: 14 },
});

export default MonthlyExpensePieChart;
