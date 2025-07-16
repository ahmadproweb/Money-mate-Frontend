import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal } from "react-native"
import styles from "../css/MoneyScreen"

export default function MoneyScreen() {
  const [expenses, setExpenses] = useState([
    { id: 1, name: "Rent", amount: 20000, type: "essentials", date: "2024-01-15" },
    { id: 2, name: "Groceries", amount: 8000, type: "essentials", date: "2024-01-14" },
    { id: 3, name: "Shopping", amount: 5000, type: "flexible", date: "2024-01-13" },
    { id: 4, name: "Entertainment", amount: 3000, type: "non-essentials", date: "2024-01-12" },
  ])
    
  const [modalVisible, setModalVisible] = useState(false)
  const [newExpense, setNewExpense] = useState({
    name: "",
    amount: "",
    type: "essentials",
  })

  const addExpense = () => {
    if (!newExpense.name || !newExpense.amount) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }
    const expense = {
      id: Date.now(),
      name: newExpense.name,
      amount: Number.parseInt(newExpense.amount),
      type: newExpense.type,
      date: new Date().toISOString().split("T")[0],
    }
    setExpenses([expense, ...expenses])
    setNewExpense({ name: "", amount: "", type: "essentials" })
    setModalVisible(false)
  }

  const deleteExpense = (id) => {
    Alert.alert("Delete Expense", "Are you sure you want to delete this expense?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setExpenses(expenses.filter((exp) => exp.id !== id)),
      },
    ])
  }

  const totalExpenses = expenses.reduce((acc, item) => acc + item.amount, 0)
  const essentialsTotal = expenses.filter((exp) => exp.type === "essentials").reduce((acc, item) => acc + item.amount, 0)
  const flexibleTotal = expenses.filter((exp) => exp.type === "flexible").reduce((acc, item) => acc + item.amount, 0)
  const nonEssentialsTotal = expenses.filter((exp) => exp.type === "non-essentials").reduce((acc, item) => acc + item.amount, 0)

  const getTypeDisplay = (type) => {
    switch(type) {
      case "essentials": return "Essentials"
      case "flexible": return "Flexible"
      case "non-essentials": return "Non Essentials"
      default: return type
    }
  }

  const getTypeColor = (type) => {
    switch(type) {
      case "essentials": return "#10B981" // Green
      case "flexible": return "#F59E0B" // Orange
      case "non-essentials": return "#EF4444" // Red
      default: return "#6B7280"
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Expense Manager</Text>
        <Text style={styles.subtitle}>Track and manage your expenses</Text>
      </View>

      <View style={styles.summaryCards}>
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Total Expenses</Text>
          <Text style={styles.cardValue}>₹{totalExpenses.toLocaleString()}</Text>
        </View>
        <View style={[styles.summaryCard, { borderLeftColor: "#10B981" }]}>
          <Text style={styles.cardTitle}>Essentials</Text>
          <Text style={[styles.cardValue, { color: "#10B981" }]}>₹{essentialsTotal.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.summaryCards}>
        <View style={[styles.summaryCard, { borderLeftColor: "#F59E0B" }]}>
          <Text style={styles.cardTitle}>Flexible</Text>
          <Text style={[styles.cardValue, { color: "#F59E0B" }]}>₹{flexibleTotal.toLocaleString()}</Text>
        </View>
        <View style={[styles.summaryCard, { borderLeftColor: "#EF4444" }]}>
          <Text style={styles.cardTitle}>Non Essentials</Text>
          <Text style={[styles.cardValue, { color: "#EF4444" }]}>₹{nonEssentialsTotal.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+ Add New Expense</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.expensesList}>
        <Text style={styles.listTitle}>Recent Expenses</Text>
        {expenses.map((expense) => (
          <View key={expense.id} style={styles.expenseItem}>
            <View style={styles.expenseInfo}>
              <View style={styles.expenseHeader}>
                <Text style={styles.expenseName}>{expense.name}</Text>
                <View
                  style={[styles.typeTag, { backgroundColor: `${getTypeColor(expense.type)}20` }]}
                >
                  <Text
                    style={[styles.typeText, { color: getTypeColor(expense.type) }]}
                  >
                    {getTypeDisplay(expense.type)}
                  </Text>
                </View>
              </View>
              <View style={styles.expenseDetails}>
                <Text style={styles.expenseAmount}>₹{expense.amount.toLocaleString()}</Text>
                <Text style={styles.expenseDate}>{expense.date}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteExpense(expense.id)}>
              <Text style={styles.deleteButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Expense</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Expense name"
              value={newExpense.name}
              onChangeText={(text) => setNewExpense({ ...newExpense, name: text })}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Amount"
              keyboardType="numeric"
              value={newExpense.amount}
              onChangeText={(text) => setNewExpense({ ...newExpense, amount: text })}
            />
            
            {/* Enhanced Type Selector with Better Visual Feedback */}
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  { borderColor: "#10B981" },
                  newExpense.type === "essentials" && styles.selectedTypeButton,
                  newExpense.type === "essentials" && { backgroundColor: "#10B981" }
                ]}
                onPress={() => setNewExpense({ ...newExpense, type: "essentials" })}
              >
                <Text style={[
                  styles.typeButtonText,
                  { color: newExpense.type === "essentials" ? "#FFFFFF" : "#10B981" },
                  newExpense.type === "essentials" && { fontWeight: "bold" }
                ]}>
                  Essentials
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  { borderColor: "#F59E0B" },
                  newExpense.type === "flexible" && styles.selectedTypeButton,
                  newExpense.type === "flexible" && { backgroundColor: "#F59E0B" }
                ]}
                onPress={() => setNewExpense({ ...newExpense, type: "flexible" })}
              >
                <Text style={[
                  styles.typeButtonText,
                  { color: newExpense.type === "flexible" ? "#FFFFFF" : "#F59E0B" },
                  newExpense.type === "flexible" && { fontWeight: "bold" }
                ]}>
                  Flexible
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  { borderColor: "#EF4444" },
                  newExpense.type === "non-essentials" && styles.selectedTypeButton,
                  newExpense.type === "non-essentials" && { backgroundColor: "#EF4444" }
                ]}
                onPress={() => setNewExpense({ ...newExpense, type: "non-essentials" })}
              >
                <Text style={[
                  styles.typeButtonText,
                  { color: newExpense.type === "non-essentials" ? "#FFFFFF" : "#EF4444" },
                  newExpense.type === "non-essentials" && { fontWeight: "bold" }
                ]}>
                  Non Essentials
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={addExpense}>
                <Text style={styles.saveButtonText}>Add Expense</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}


