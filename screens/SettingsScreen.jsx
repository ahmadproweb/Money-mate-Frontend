
import { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
  TextInput,
  Pressable,
} from "react-native"
import { useAppContext } from "../context/AppContext"
import { Toast } from "../components/Toast"
import { useToast } from "../hooks/useToast"
import styles from "../css/SettingsScreen"
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Feather"
import { Linking } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLoading } from "../context/LoadingContext"

export default function SettingsScreen({ navigation }) {
  const { currency, setCurrency, budgetCycle, setBudgetCycle } = useAppContext()

  const [passwordModalVisible, setPasswordModalVisible] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false)
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false)
  const [budgetCycleModalVisible, setBudgetCycleModalVisible] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { showLoader, hideLoader } = useLoading();

  const { toast, showToast, hideToast } = useToast()

  const handleLogout = async () => {
    showLoader();
    try {
      await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      await AsyncStorage.removeItem("token");
      showToast("Logged out successfully!", "info");
      setTimeout(() => {
        navigation.reset({ index: 0, routes: [{ name: "Login" }] });
      }, 1000);
    } catch (error) {
      showToast("Logout failed", "error");
    } finally {
      hideLoader();
    }
  };

  const handleDeleteAccount = () => {
    setConfirmDeleteModalVisible(true)
  }

  const confirmDelete = async () => {
    showLoader();
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/delete-account`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        await AsyncStorage.removeItem("token");
        showToast("Account deleted successfully", "success");
        setTimeout(() => {
          navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        }, 1000);
      } else {
        showToast("Failed to delete account", "error");
      }
    } catch (error) {
      showToast("Something went wrong", "error");
    } finally {
      hideLoader();
    }
  };

  const handleBudgetCycleChange = (cycle) => {
    setBudgetCycle(cycle)
    setBudgetCycleModalVisible(false)
    showToast(`Budget cycle set to ${cycle}`, "success")
  }

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    setCurrencyModalVisible(false);
    showToast(`Currency changed to ${newCurrency}`, "success");
  };


  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    showLoader();
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("Password changed successfully!", "success");
        setPasswordModalVisible(false);
        setNewPassword("");
        setConfirmPassword("");
      } else {
        showToast(data.message || "Failed to change password", "error");
      }
    } catch (error) {
      showToast("Something went wrong", "error");
    } finally {
      hideLoader();
    }
  };


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
        <Text style={styles.footerText}>Money Mate v1.0.0</Text>
        <Text style={styles.footerSubtext}>Made with ❤️ for better financial management</Text>
      </View>
      <View style={styles.devContainer}>
        <Text style={styles.devText}>
          <Text style={{ fontWeight: 'bold' }}>💼 Open for work :</Text> freelance, consulting, or collaboration.
        </Text>
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.fiverr.com/ahmad_pro_web')}>
            <Image
              source={require('../assets/fiver.png')}
              style={{ width: 26, height: 26, marginHorizontal: 6 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://ahmadproweb.com')}>
            <MaterialCommunityIcons name="web" size={26} color="#333" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('mailto:contact@ahmadproweb.com')}>
            <MaterialCommunityIcons name="email" size={26} color="#EA4335" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://github.com/ahmadproweb')}>
            <MaterialCommunityIcons name="github" size={26} color="#181717" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://linkedin.com/in/ahmadproweb')}>
            <FontAwesome name="linkedin" size={26} color="#0077B5" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://wa.me/+923106082642')}>
            <FontAwesome name="whatsapp" size={26} color="#25D366" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://instagram.com/ahmadproweb')}>
            <FontAwesome name="instagram" size={26} color="#C13584" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://facebook.com/ahmadprowebofficial')}>
            <FontAwesome name="facebook" size={26} color="#1877F2" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <Modal animationType="slide" transparent visible={passwordModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="New Password"
                secureTextEntry={!showNewPassword}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                <Icon
                  name={showNewPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm Password"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Icon
                  name={showConfirmPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

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

      <Modal transparent visible={currencyModalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Currency</Text>

            {["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "INR"].map((item) => (
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
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: currency === item ? "700" : "400",
                    color: currency === item ? "#0284C7" : "#1F2937",
                  }}
                >
                  {item}
                </Text>

                {currency === item && (
                  <Text style={{ fontSize: 16, color: "#0284C7" }}>✓</Text>
                )}
              </Pressable>
            ))}

            <TouchableOpacity
              onPress={() => setCurrencyModalVisible(false)}
              style={{
                marginTop: 16,
                borderRadius: 10,
              }}
            >
              <Text style={{ textAlign: "center", color: "#6B7280", fontSize: 25 }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


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
            <TouchableOpacity
              onPress={() => setBudgetCycleModalVisible(false)}
              style={{
                marginTop: 16,
                borderRadius: 10,
              }}
            >
              <Text style={{ textAlign: "center", color: "#6B7280", fontSize: 25 }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}
