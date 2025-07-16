
import { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Pressable,
} from "react-native"
import { useAppContext } from "../context/AppContext"
import { Toast } from "../components/Toast"
import { useToast } from "../hooks/useToast"
import styles from "../css/SettingsScreen"

export default function SettingsScreen({ navigation }) {
  const { currency, setCurrency, budgetCycle, setBudgetCycle } = useAppContext()

  const [passwordModalVisible, setPasswordModalVisible] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false)
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false)
  const [budgetCycleModalVisible, setBudgetCycleModalVisible] = useState(false)

  const { toast, showToast, hideToast } = useToast()

  const handleLogout = () => {
    showToast("Logged out successfully!", "info")
    setTimeout(() => {
      navigation.reset({ index: 0, routes: [{ name: "Login" }] })
    }, 1000)
  }

  const handleDeleteAccount = () => {
    setConfirmDeleteModalVisible(true)
  }

  const confirmDelete = () => {
    setConfirmDeleteModalVisible(false)
    showToast("Account deleted successfully", "success")
    setTimeout(() => {
      navigation.reset({ index: 0, routes: [{ name: "Login" }] })
    }, 1000)
  }

  const handleBudgetCycleChange = (cycle) => {
    setBudgetCycle(cycle)
    setBudgetCycleModalVisible(false)
    showToast(`Budget cycle set to ${cycle}`, "success")
  }

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency)
    setCurrencyModalVisible(false)
    showToast(`Currency changed to ${newCurrency}`, "success")
  }

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "error")
      return
    }
    if (newPassword.length < 6) {
      showToast("Password must be at least 6 characters", "error")
      return
    }
    showToast("Password changed successfully!", "success")
    setPasswordModalVisible(false)
    setNewPassword("")
    setConfirmPassword("")
  }

  const SettingItem = ({ title, subtitle, onPress, rightComponent }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightComponent}
    </TouchableOpacity>
  )

  return (
    <ScrollView style={styles.container}>
      <Toast {...toast} onHide={hideToast} />

      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your app experience</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Currency & Budget</Text>
        <SettingItem
          title="Default Currency"
          subtitle={`Currently set to ${currency}`}
          onPress={() => setCurrencyModalVisible(true)}
          rightComponent={<Text style={styles.arrowText}>›</Text>}
        />
        <SettingItem
          title="Budget Cycle"
          subtitle={`${budgetCycle} budget reset`}
          onPress={() => setBudgetCycleModalVisible(true)}
          rightComponent={<Text style={styles.arrowText}>›</Text>}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <SettingItem
          title="Change Password"
          subtitle="Update your account password"
          onPress={() => setPasswordModalVisible(true)}
          rightComponent={<Text style={styles.arrowText}>›</Text>}
        />
        <SettingItem
          title="Delete Account"
          subtitle="Permanently delete your account"
          onPress={handleDeleteAccount}
          rightComponent={<Text style={[styles.arrowText, { color: "#EF4444" }]}>›</Text>}
        />
      </View>

      <View style={styles.dangerSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Budget Tracker v1.0.0</Text>
        <Text style={styles.footerSubtext}>Made with ❤️ for better financial management</Text>
      </View>

      {/* Password Modal */}
      <Modal animationType="slide" transparent visible={passwordModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Confirm Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setPasswordModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
                <Text style={styles.saveButtonText}>Change Password</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal transparent visible={confirmDeleteModalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Are you sure?</Text>
            <Text style={{ textAlign: "center", marginBottom: 20 }}>
              This will permanently delete your account and all data.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setConfirmDeleteModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={confirmDelete}>
                <Text style={styles.saveButtonText}>Yes, Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Currency Modal */}
      <Modal transparent visible={currencyModalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Currency</Text>
            {["INR", "USD", "EUR", "GBP"].map((item) => (
              <Pressable
                key={item}
                onPress={() => handleCurrencyChange(item)}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  backgroundColor: currency === item ? "#E0F2FE" : "#FFFFFF",
                  borderRadius: 10,
                  marginBottom: 8,
                  alignSelf: "stretch",
                }}
              >
                <Text style={{
                  textAlign: "center",
                  fontSize: 16,
                  fontWeight: currency === item ? "700" : "400",
                  color: currency === item ? "#0284C7" : "#1F2937"
                }}>
                  {item} {currency === item ? "✓" : ""}
                </Text>
              </Pressable>
            ))}

          </View>
        </View>
      </Modal>

      {/* Budget Cycle Modal */}
      <Modal transparent visible={budgetCycleModalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Budget Cycle</Text>
            {["Weekly", "Bi-Weekly", "Monthly"].map((item) => (
              <Pressable
                key={item}
                onPress={() => handleBudgetCycleChange(item)}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  backgroundColor: budgetCycle === item ? "#E0F2FE" : "#FFFFFF",
                  borderRadius: 10,
                  marginBottom: 8,
                  alignSelf: "stretch",
                }}
              >
                <Text style={{
                  textAlign: "center",
                  fontSize: 16,
                  fontWeight: budgetCycle === item ? "700" : "400",
                  color: budgetCycle === item ? "#0284C7" : "#1F2937"
                }}>
                  {item} {budgetCycle === item ? "✓" : ""}
                </Text>
              </Pressable>
            ))}

          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}
