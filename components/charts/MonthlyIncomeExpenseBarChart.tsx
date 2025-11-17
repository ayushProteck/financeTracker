import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

interface Transaction {
  id: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  category: string;
}

interface Props {
  transactions?: Transaction[];
}

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const MonthlyIncomeExpenseBarChart: React.FC<Props> = ({ transactions = [], }) => {
  const textColor = useThemeColor({}, 'text')
  const hasData = Array.isArray(transactions) && transactions.length > 0;

  // Compute monthly totals for current year
  const monthlyData = useMemo(() => {
    if (!hasData) return [];

    const now = new Date();
    const currentYear = now.getFullYear();

    const totals: Record<number, { income: number; expense: number }> = {};
    transactions.forEach(tx => {
      const txDate = new Date(tx.date);
      if (txDate.getFullYear() === currentYear) {
        const month = txDate.getMonth();
        if (!totals[month]) totals[month] = { income: 0, expense: 0 };
        if (tx.type === 'income') {
          totals[month].income += tx.amount;
        } else {
          totals[month].expense += tx.amount;
        }
      }
    });

    return MONTH_LABELS.map((label, idx) => ({
      label,
      income: totals[idx]?.income ?? 0,
      expense: totals[idx]?.expense ?? 0,
    }));
  }, [transactions, hasData]);

  const chartData = useMemo(() => {
    if (monthlyData.length === 0) return [];
    return monthlyData.flatMap(m => [
      {
        value: m.income,
        frontColor: Colors.income,
        gradientColor: '#009FFF',
        spacing: 0,
        label: m.label,
        
      },
      {
        value: m.expense,
        frontColor: Colors.expense,
        gradientColor: '#93FCF8',
      },
    ]);
  }, [monthlyData]);

  const hasMeaningfulValues = chartData.some(b => (b.value ?? 0) > 0);

  const maxValue = useMemo(() => {
    if (!hasMeaningfulValues) return 2000;
    const max = Math.max(...chartData.map(b => b.value ?? 0));
    return Math.ceil(max / 2000) * 2000;
  }, [chartData, hasMeaningfulValues]);

  const formatYAxisLabel = (val: string) => (Number(val) >= 1000 ? `${Number(val) / 1000}k` : val.toString());

  return (
    <View style={styles.section}>
      <ThemedText type="title" style={[styles.heading, { marginTop: 24 }]}>
        Income & Expense vs Months
      </ThemedText>

      {!hasData || !hasMeaningfulValues ? (
        <ThemedText type="subtitle" style={styles.message}>
          No monthly income/expense data available for this year.
        </ThemedText>
      ) : (
        <BarChart
          // horizontal
          data={chartData}
          barWidth={20}
          spacing={20}
          hideRules={false}
          stepValue={2000}
          maxValue={maxValue}
          xAxisThickness={1}
          yAxisThickness={1}
          yAxisTextStyle={{ color: textColor }}
          xAxisLabelTextStyle={{ color: textColor }}
          xAxisColor={textColor}
          yAxisColor={textColor}
          // showValuesAsTopLabel
          
          overflowTop={20}
          topLabelTextStyle={{
            color: "yellow"
          }}
          formatYLabel={formatYAxisLabel}
        />
      )}
    </View>
  );
};


export default MonthlyIncomeExpenseBarChart;


const styles = StyleSheet.create({
  section: { margin: 16 },
  heading: { marginBottom: 12, fontWeight: 'bold', fontSize: 18 },
  message: { textAlign: 'center', marginTop: 8, fontSize: 14 },
});