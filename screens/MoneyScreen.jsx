import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal, ActivityIndicator } from "react-native";
import styles from "../css/MoneyScreen";
import { useUser } from "../context/UserContext";
import { useToast } from "../hooks/useToast";
import { Toast } from "../components/Toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppContext } from "../context/AppContext";
import { useLoading } from "../context/LoadingContext";

export default function MoneyScreen() {
  const { profile, loading, fetchProfile } = useUser();
  const { toast, showToast, hideToast } = useToast();
  const { currencySymbol } = useAppContext();
  const { showLoader, hideLoader } = useLoading();

  const [modalVisible, setModalVisible] = useState(false);
  const [newExpense, setNewExpense] = useState({
    name: "",
    amount: "",
    type: "essentials",
  });

  const handleAddExpense = async () => {
    if (!newExpense.name || !newExpense.amount) {
      showToast("Please fill in all fields", "error");
      return;
    }
    showLoader();
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newExpense.name,
          amount: Number.parseInt(newExpense.amount),
          category: newExpense.type,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Failed to add expense", "error");
        return;
      }

      showToast("Expense added successfully!", "success");
      setNewExpense({ name: "", amount: "", type: "essentials" });
      setModalVisible(false);
      fetchProfile();
    } catch (err) {
      showToast("Something went wrong", "error");
    } finally {
      hideLoader();
    }
  };

  const handleDeleteExpense = (id) => {
    Alert.alert("Delete Expense", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          showLoader();
          try {
            const token = await AsyncStorage.getItem("token");
            const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/expenses/${id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            const data = await res.json();
            if (!res.ok) {
              showToast(data.message || "Failed to delete", "error");
              return;
            }

            showToast(data.message, "success");
            fetchProfile();
          } catch (err) {
            showToast("Error deleting expense", "error");
          } finally {
            hideLoader();
          }
        },
      },
    ]);
  };

  const getTypeDisplay = (type) => {
    switch (type) {
      case "essentials": return "Essentials";
      case "flexible": return "Flexible";
      case "non-essentials": return "Non Essentials";
      default: return type;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "essentials": return "#10B981";
      case "flexible": return "#F59E0B";
      case "non-essentials": return "#EF4444";
      default: return "#6B7280";
    }
  };

  const expenses = profile?.expenses || [];

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const essentialsTotal = expenses.filter((e) => e.category === "essentials").reduce((sum, e) => sum + e.amount, 0);
  const flexibleTotal = expenses.filter((e) => e.category === "flexible").reduce((sum, e) => sum + e.amount, 0);
  const nonEssentialsTotal = expenses.filter((e) => e.category === "non-essentials").reduce((sum, e) => sum + e.amount, 0);

  if (loading) return <View style={styles.container}>
    <Text style={styles.title}>Money Mate</Text>
    <ActivityIndicator size="large" color="#4A90E2" style={{ marginTop: 40 }} />
  </View>;

  return (
    <View style={styles.container}>
      <Toast visible={toast.visible} message={toast.message} type={toast.type} duration={toast.duration} onHide={hideToast} />

      <View style={styles.header}>
        <Text style={styles.title}>Expense Manager</Text>
        <Text style={styles.subtitle}>Track and manage your expenses</Text>
      </View>

      <View style={styles.summaryCards}>
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Total Expenses</Text>
          <Text style={styles.cardValue}>{currencySymbol}{totalExpenses.toLocaleString()}</Text>
        </View>
        <View style={[styles.summaryCard, { borderLeftColor: "#10B981" }]}>
          <Text style={styles.cardTitle}>Essentials</Text>
          <Text style={[styles.cardValue, { color: "#10B981" }]}>{currencySymbol}{essentialsTotal.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.summaryCards}>
        <View style={[styles.summaryCard, { borderLeftColor: "#F59E0B" }]}>
          <Text style={styles.cardTitle}>Flexible</Text>
          <Text style={[styles.cardValue, { color: "#F59E0B" }]}>{currencySymbol}{flexibleTotal.toLocaleString()}</Text>
        </View>
        <View style={[styles.summaryCard, { borderLeftColor: "#EF4444" }]}>
          <Text style={styles.cardTitle}>Non Essentials</Text>
          <Text style={[styles.cardValue, { color: "#EF4444" }]}>{currencySymbol}{nonEssentialsTotal.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+ Add New Expense</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.expensesList}>
        {expenses.map((expense) => (
          <View key={expense._id} style={styles.expenseItem}>
            <View style={styles.expenseInfo}>
              <View style={styles.expenseHeader}>
                <Text style={styles.expenseName}>{expense.name}</Text>
                <View style={[styles.typeTag, { backgroundColor: `${getTypeColor(expense.category)}20` }]}>
                  <Text style={[styles.typeText, { color: getTypeColor(expense.category) }]}>
                    {getTypeDisplay(expense.category)}
                  </Text>
                </View>
              </View>
              <View style={styles.expenseDetails}>
                <Text style={styles.expenseAmount}>{currencySymbol}{expense.amount.toLocaleString()}</Text>
                <Text style={styles.expenseDate}> {new Date(expense.createdAt).toLocaleString()}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteExpense(expense._id)}>
              <Text style={styles.deleteButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Expense</Text>
            <TextInput style={styles.modalInput} placeholderTextColor="#888" placeholder="Expense name" value={newExpense.name} onChangeText={(text) => setNewExpense({ ...newExpense, name: text })} />
            <TextInput style={styles.modalInput} placeholderTextColor="#888" placeholder="Amount" keyboardType="numeric" value={newExpense.amount} onChangeText={(text) => setNewExpense({ ...newExpense, amount: text })} />

            <View style={styles.typeSelector}>
              {["essentials", "flexible", "non-essentials"].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    {
                      borderColor: getTypeColor(type),
                      backgroundColor: newExpense.type === type ? getTypeColor(type) : "#fff",
                    },
                  ]}
                  onPress={() => setNewExpense({ ...newExpense, type })}
                >
                  <Text style={{
                    color: newExpense.type === type ? "#fff" : getTypeColor(type),
                    fontWeight: newExpense.type === type ? "bold" : "normal",
                  }}>
                    {getTypeDisplay(type)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleAddExpense}>
                <Text style={styles.saveButtonText}>Add Expense</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
