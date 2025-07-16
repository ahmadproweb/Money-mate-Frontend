
import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, Dimensions, ScrollView, Alert } from "react-native"
import { PieChart } from "react-native-chart-kit"
import { useAppContext } from "../context/AppContext"
import styles from "../css/HomeScreenStyles"

export default function HomeScreen() {
  const { budgetCycle } = useAppContext()
  const [salary, setSalary] = useState("")
  const [isLocked, setIsLocked] = useState(false)

  const [expenses, setExpenses] = useState([
    { id: 1, name: "Rent", amount: 20000, type: "essentials", color: "#10B981" },
    { id: 2, name: "Groceries", amount: 8000, type: "essentials", color: "#10B981" },
    { id: 3, name: "Shopping", amount: 5000, type: "flexible", color: "#F59E0B" },
    { id: 4, name: "Entertainment", amount: 3000, type: "non-essentials", color: "#EF4444" },
    { id: 5, name: "Utilities", amount: 4000, type: "essentials", color: "#10B981" },
    { id: 6, name: "Dining Out", amount: 2500, type: "flexible", color: "#F59E0B" },
  ])

  const totalExpenses = expenses.reduce((acc, item) => acc + item.amount, 0)
  const remaining = Number.parseInt(salary || "0") - totalExpenses
  const salaryNum = Number.parseInt(salary || "0")

  const essentialsTotal = expenses
    .filter((exp) => exp.type === "essentials")
    .reduce((acc, item) => acc + item.amount, 0)

  const flexibleTotal = expenses.filter((exp) => exp.type === "flexible").reduce((acc, item) => acc + item.amount, 0)

  const nonEssentialsTotal = expenses
    .filter((exp) => exp.type === "non-essentials")
    .reduce((acc, item) => acc + item.amount, 0)

  const pieData = [
    {
      name: "Essentials",
      amount: essentialsTotal,
      color: "#10B981",
      legendFontColor: "#333",
      legendFontSize: 12,
    },
    {
      name: "Flexible",
      amount: flexibleTotal,
      color: "#F59E0B",
      legendFontColor: "#333",
      legendFontSize: 12,
    },
    {
      name: "Non Essentials",
      amount: nonEssentialsTotal,
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
  ].filter((item) => item.amount > 0) // Only show categories with amounts > 0

  const handleLockSalary = () => {
    if (!salary || salary === "0") {
      Alert.alert("Error", "Please enter a valid salary amount")
      return
    }
    setIsLocked(!isLocked)
  }

  // Filter expenses by category
  const essentialsExpenses = expenses.filter((exp) => exp.type === "essentials")
  const flexibleExpenses = expenses.filter((exp) => exp.type === "flexible")
  const nonEssentialsExpenses = expenses.filter((exp) => exp.type === "non-essentials")

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Monthly Budget</Text>
        <Text style={styles.subtitle}>Track your income and expenses</Text>
      </View>

      <View style={styles.salarySection}>
        <Text style={styles.sectionTitle}>Monthly Salary</Text>
        <TextInput
          style={[styles.input, isLocked && styles.disabledInput]}
          editable={!isLocked}
          keyboardType="numeric"
          value={salary}
          onChangeText={setSalary}
          placeholder="Enter your salary"
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity style={[styles.button, isLocked && styles.lockedButton]} onPress={handleLockSalary}>
          <Text style={styles.buttonText}>{isLocked ? "🔒 Edit Salary" : "🔓 Lock Salary"}</Text>
        </TouchableOpacity>
      </View>

      <>
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Income</Text>
              <Text style={styles.summaryValue}>₹{salaryNum.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Expenses</Text>
              <Text style={[styles.summaryValue, { color: "#EF4444" }]}>₹{totalExpenses.toLocaleString()}</Text>
            </View>
          </View>
          <View style={styles.remainingSection}>
            <Text style={styles.summaryLabel}>Remaining</Text>
            <Text style={[styles.remainingValue, { color: remaining >= 0 ? "#10B981" : "#EF4444" }]}>
              ₹{remaining.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Expense Breakdown</Text>
          {/* Budget Cycle Display */}
          <View style={styles.budgetCycleContainer}>
            <Text style={styles.budgetCycleText}>{budgetCycle} Budget Cycle</Text>
          </View>

          {/* Category Summary Cards */}
          <View style={styles.categorySummary}>
            <View style={styles.summaryCard}>
              <View style={[styles.colorIndicator, { backgroundColor: "#10B981" }]} />
              <Text style={styles.categoryName}>Essentials</Text>
              <Text style={styles.categoryAmount}>₹{essentialsTotal.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryCard}>
              <View style={[styles.colorIndicator, { backgroundColor: "#F59E0B" }]} />
              <Text style={styles.categoryName}>Flexible</Text>
              <Text style={styles.categoryAmount}>₹{flexibleTotal.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryCard}>
              <View style={[styles.colorIndicator, { backgroundColor: "#EF4444" }]} />
              <Text style={styles.categoryName}>Non Essential</Text>
              <Text style={styles.categoryAmount}>₹{nonEssentialsTotal.toLocaleString()}</Text>
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

        {/* Updated Expense Categories - Now showing all three categories */}
        <View style={styles.expenseCategories}>
          {/* Essentials Section */}
          <View style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryIndicator, { backgroundColor: "#10B981" }]} />
              <Text style={styles.categoryTitle}>Essentials</Text>
              <Text style={styles.categoryTotal}>₹{essentialsTotal.toLocaleString()}</Text>
            </View>
            {essentialsExpenses.map((expense) => (
              <View key={expense.id} style={styles.expenseItem}>
                <Text style={styles.expenseName}>{expense.name}</Text>
                <Text style={styles.expenseAmount}>₹{expense.amount.toLocaleString()}</Text>
              </View>
            ))}
            {essentialsExpenses.length === 0 && (
              <Text style={styles.noExpensesText}>No essential expenses added yet</Text>
            )}
          </View>

          {/* Flexible Section */}
          <View style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryIndicator, { backgroundColor: "#F59E0B" }]} />
              <Text style={styles.categoryTitle}>Flexible</Text>
              <Text style={styles.categoryTotal}>₹{flexibleTotal.toLocaleString()}</Text>
            </View>
            {flexibleExpenses.map((expense) => (
              <View key={expense.id} style={styles.expenseItem}>
                <Text style={styles.expenseName}>{expense.name}</Text>
                <Text style={styles.expenseAmount}>₹{expense.amount.toLocaleString()}</Text>
              </View>
            ))}
            {flexibleExpenses.length === 0 && <Text style={styles.noExpensesText}>No flexible expenses added yet</Text>}
          </View>

          {/* Non Essentials Section */}
          <View style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryIndicator, { backgroundColor: "#EF4444" }]} />
              <Text style={styles.categoryTitle}>Non Essentials</Text>
              <Text style={styles.categoryTotal}>₹{nonEssentialsTotal.toLocaleString()}</Text>
            </View>
            {nonEssentialsExpenses.map((expense) => (
              <View key={expense.id} style={styles.expenseItem}>
                <Text style={styles.expenseName}>{expense.name}</Text>
                <Text style={styles.expenseAmount}>₹{expense.amount.toLocaleString()}</Text>
              </View>
            ))}
            {nonEssentialsExpenses.length === 0 && (
              <Text style={styles.noExpensesText}>No non-essential expenses added yet</Text>
            )}
          </View>
        </View>
      </>
    </ScrollView>
  )
}

