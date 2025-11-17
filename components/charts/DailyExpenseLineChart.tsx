import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

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

const DailyExpenseLineChart: React.FC<Props> = ({ transactions = [] }) => {
  const hasData = Array.isArray(transactions) && transactions.length > 0;
  const textColor = useThemeColor({}, 'text')
  const normalizedData = useMemo(() => {
    if (!hasData) return [];

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const filtered = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return tx.type === 'expense' &&
        txDate.getMonth() === currentMonth &&
        txDate.getFullYear() === currentYear;
    });

    if (filtered.length === 0) return [];

    const dayMap: Record<number, number> = {};
    filtered.forEach(tx => {
      const day = new Date(tx.date).getDate();
      dayMap[day] = (dayMap[day] || 0) + tx.amount;
    });

    const minDay = Math.min(...Object.keys(dayMap).map(d => parseInt(d, 10)));
    const maxDay = now.getDate();

    const filled: { value: number; label: string; dataPointText?: string }[] = [];
    for (let day = minDay; day <= maxDay; day++) {
      if(dayMap[day]){
        filled.push({ label: day.toString(), value: dayMap[day] || 0, dataPointText: ""+dayMap[day] || " " });
      } else {
        filled.push({ label: day.toString(), value: 0,});
      }
    }

    return filled;
  }, [transactions, hasData]);

  return (
    <View style={styles.section}>
      <ThemedText type="title" style={styles.heading}>Daily Expenses (This Month)</ThemedText>

      {!hasData || normalizedData.length === 0 ? (
        <ThemedText type="subtitle" style={styles.message}>
          No daily expense data available for this month.
        </ThemedText>
      ) : (
        <LineChart
          data={normalizedData}
          color="red"
          thickness={3}
          isAnimated
          hideDataPoints={false}
          dataPointsColor="red"
          stepValue={100}
          yAxisTextStyle={{ color: textColor }}
          xAxisLabelTextStyle={{ color: textColor }}
          xAxisColor={textColor}
          yAxisColor={textColor}
          // dataPointsColor1={Colors.expense}
          textColor1={"yellow"}
          textFontSize1={12}
          textShiftY={-8}
          textShiftX={-10}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: { margin: 16, alignItems: 'flex-start' },
  heading: { marginBottom: 12, fontWeight: 'bold', fontSize: 18 },
  message: { textAlign: 'center', marginTop: 8, fontSize: 14 },
  tooltip: { padding: 6, borderRadius: 6, borderWidth: 1, borderColor: '#ccc' },
//   tooltipText: { fontSize: 12 },
});

export default DailyExpenseLineChart;
