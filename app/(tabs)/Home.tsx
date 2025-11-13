import MonthlySummary from "@/components/MonthlySummary";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import AppButton from "@/components/ui/appButton";
import { fetchTransactions } from "@/data/transactions";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
    useFocusEffect,
    // router,
    useNavigation
} from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function HomeScreen() {
    const navigation = useNavigation();

    const [incomeTotal, setIncomeTotal] = useState(0);
    const [expenseTotal, setExpenseTotal] = useState(0);
    useFocusEffect(useCallback(() => {
        const load = async () => {
          const txs = await fetchTransactions();
          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();
    
          const filtered = txs.filter(tx => {
            const txDate = new Date(tx.date);
            return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
          });
    
          const income = filtered
            .filter(tx => tx.type === 'income')
            .reduce((sum, tx) => sum + tx.amount, 0);
    
          const expense = filtered
            .filter(tx => tx.type === 'expense')
            .reduce((sum, tx) => sum + tx.amount, 0);
    
          setIncomeTotal(income);
          setExpenseTotal(expense);
        };
    
        load();
      }, []));  

    return <ThemedView style={styles.container}>
        <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems : "center",
                    marginHorizontal: 10
                }}
            >
                <ThemedText type="default" >
                    Summary
                </ThemedText>
                <AppButton
                    type="primary"
                    onPress={()=>{
                        navigation.navigate("AddTransaction")
                        // router.replace("/(tabs)/AddTransaction");
                    }}
                >
                    <MaterialIcons
                        name="add-circle-outline"
                        size={14}
                        color={"#fff"}
                    />
                </AppButton>
            </View>
            <MonthlySummary incomeTotal={incomeTotal} expenseTotal={expenseTotal} />
    </ThemedView>
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
    }
});