import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import styles from "../css/HomeScreenStyles";
import { useAppContext } from "../context/AppContext";
import { useUser } from "../context/UserContext";
import { useToast } from "../hooks/useToast";
import { Toast } from "../components/Toast";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const { budgetCycle, currencySymbol } = useAppContext();
  const { profile, loading, fetchProfile } = useUser();
  const { toast, showToast, hideToast } = useToast();
  const [salary, setSalary] = useState("");
  const [isLocked, setIsLocked] = useState(false);

  if (loading || !profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Money Mate</Text>
        <ActivityIndicator size="large" color="#4A90E2" style={{ marginTop: 40 }} />
      </View>
    );
  }

  const { totalIncome, totalExpenses, remaining, expenses, categoryTotals } = profile;

  const handleLockSalary = async () => {
    if (!salary || isNaN(salary) || Number(salary) <= 0) {
      showToast("Please enter a valid salary amount", "error");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch("http://10.205.240.128:3000/api/user/income", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ totalIncome: Number(salary) }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update income");
      }

      showToast(data.message || "Income updated", "success");
      await fetchProfile();
      setIsLocked(true);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const essentialsExpenses = expenses.filter((e) => e.category === "essentials");
  const flexibleExpenses = expenses.filter((e) => e.category === "flexible");
  const nonEssentialsExpenses = expenses.filter((e) => e.category === "non-essentials");

  const pieData = [
    {
      name: "Essentials",
      amount: categoryTotals.essentials,
      color: "#10B981",
      legendFontColor: "#333",
      legendFontSize: 12,
    },
    {
      name: "Flexible",
      amount: categoryTotals.flexible,
      color: "#F59E0B",
      legendFontColor: "#333",
      legendFontSize: 12,
    },
    {
      name: "Non Essentials",
      amount: categoryTotals["non-essentials"],
      color: "#EF4444",
      legendFontColor: "#333",
      legendFontSize: 12,
    },
    {
      name: "Remaining",
      amount: remaining > 0 ? remaining : 0,
      color: "#6B7280",
      legendFontColor: "#333",
      legendFontSize: 12,
    },
  ].filter((item) => item.amount > 0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{budgetCycle} Tracker</Text>
        <Text style={styles.subtitle}>Track your income and expenses</Text>
      </View>

      <View style={styles.salarySection}>
        <Text style={styles.sectionTitle}>{budgetCycle} Tracker</Text>
        <TextInput
          style={[styles.input, isLocked && styles.disabledInput]}
          editable={!isLocked}
          keyboardType="numeric"
          value={salary}
          onChangeText={setSalary}
          placeholder="Enter your salary"
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity
          style={[styles.button, isLocked && styles.lockedButton]}
          onPress={handleLockSalary}
        >
          <Text style={styles.buttonText}>{isLocked ? "🔒 Edit Salary" : "🔓 Lock Salary"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summarySection}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Income</Text>
            <Text style={styles.summaryValue}>{currencySymbol}{totalIncome.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Expenses</Text>
            <Text style={[styles.summaryValue, { color: "#EF4444" }]}>
              {currencySymbol}{totalExpenses.toLocaleString()}
            </Text>
          </View>
        </View>
        <View style={styles.remainingSection}>
          <Text style={styles.summaryLabel}>Remaining</Text>
          <Text
            style={[
              styles.remainingValue,
              { color: remaining >= 0 ? "#10B981" : "#EF4444" },
            ]}
          >
            {currencySymbol} {remaining.toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>Expense Breakdown</Text>
        <View style={styles.budgetCycleContainer}>
          <Text style={styles.budgetCycleText}>{budgetCycle} Budget Cycle</Text>
        </View>

        <View style={styles.categorySummary}>
          <View style={styles.summaryCard}>
            <View style={[styles.colorIndicator, { backgroundColor: "#10B981" }]} />
            <Text style={styles.categoryName}>Essentials</Text>
            <Text style={styles.categoryAmount}>
              {currencySymbol}{categoryTotals.essentials.toLocaleString()}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <View style={[styles.colorIndicator, { backgroundColor: "#F59E0B" }]} />
            <Text style={styles.categoryName}>Flexible</Text>
            <Text style={styles.categoryAmount}>
              {currencySymbol}{categoryTotals.flexible.toLocaleString()}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <View style={[styles.colorIndicator, { backgroundColor: "#EF4444" }]} />
            <Text style={styles.categoryName}>Non Essential</Text>
            <Text style={styles.categoryAmount}>
              {currencySymbol}{categoryTotals["non-essentials"].toLocaleString()}
            </Text>
          </View>
        </View>

        <PieChart
          data={pieData}
          width={Dimensions.get("window").width - 40}
          height={220}
          chartConfig={{
            color: () => `#000`,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>
      <View style={styles.categoryMain}>

        {[
          { title: "Essentials", data: essentialsExpenses, color: "#10B981", key: "essentials" },
          { title: "Flexible", data: flexibleExpenses, color: "#F59E0B", key: "flexible" },
          { title: "Non Essentials", data: nonEssentialsExpenses, color: "#EF4444", key: "non-essentials" },
        ].map(({ title, data, color, key }) => (
          <View key={key} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryIndicator, { backgroundColor: color }]} />
              <Text style={styles.categoryTitle}>{title}</Text>
              <Text style={styles.categoryTotal}>{currencySymbol}{categoryTotals[key].toLocaleString()}</Text>
            </View>
            {data.length > 0 ? (
              data.map((exp) => (
                <View key={exp._id} style={styles.expenseItem}>
                  <Text style={styles.expenseName}>{exp.name}</Text>
                  <Text style={styles.expenseAmount}>{currencySymbol}{exp.amount.toLocaleString()}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noExpensesText}>No {title.toLowerCase()} expenses added yet</Text>
            )}
          </View>
        ))}
      </View>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        duration={toast.duration}
        onHide={hideToast}
      />
    </ScrollView>
  );
}
