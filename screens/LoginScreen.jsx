import { useState, useRef } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  Modal,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"
import { Toast } from "../components/Toast"
import { useToast } from "../hooks/useToast"
import { useUser } from "../context/UserContext";
import styles from "../css/LoginScreen"
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function LoginScreen({ navigation }) {
  const [showPassword, setShowPassword] = useState(false)
  const [focusedInput, setFocusedInput] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const passwordRef = useRef(null)

  const { toast, showToast, hideToast } = useToast()
  const { fetchProfile } = useUser();

  const [forgotPasswordModalVisible, setForgotPasswordModalVisible] = useState(false)
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1)
  const [forgotEmail, setForgotEmail] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", ""])
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [focusedOtpIndex, setFocusedOtpIndex] = useState(null)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)

  const otpInputRefs = useRef([])

  const isButtonDisabled = !email || !password

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp]
    newOtp[index] = text
    setOtp(newOtp)
    if (text && index < 4) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    }
  }

  const handleForgotPasswordSubmit = async () => {
    if (forgotPasswordStep === 1) {
      if (forgotEmail) {
        try {
          const response = await fetch("http://10.205.240.128:3000/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: forgotEmail }),
          })
          const data = await response.json()

          if (!response.ok) {
            showToast(data.message || "Failed to send OTP", "error")
            return
          }

          showToast(data.message || "OTP sent to your email!", "success")
          setForgotPasswordStep(2)
        } catch (error) {
          showToast("Network error", "error")
        }
      } else {
        showToast("Please enter your email address", "error")
      }
    } else if (forgotPasswordStep === 2) {
      const otpCode = otp.join("")
      if (otpCode.length === 5) {
        setForgotPasswordStep(3)
      } else {
        showToast("Please enter complete OTP", "error")
      }
    } else if (forgotPasswordStep === 3) {
      if (newPassword === confirmNewPassword && newPassword.length >= 6) {
        try {
          const response = await fetch("http://10.205.240.128:3000/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: forgotEmail,
              code: otp.join(""),
              newPassword,
            }),
          })

          const data = await response.json()

          if (!response.ok) {
            showToast(data.message || "Failed to reset password", "error")

            if (
              data.message?.toLowerCase().includes("invalid code") ||
              data.message?.toLowerCase().includes("expired")
            ) {
              setForgotPasswordStep(2)
            }

            return
          }

          showToast(data.message || "Password reset successfully!", "success")
          resetForgotPasswordModal()
        } catch (error) {
          showToast("Network error", "error")
        }
      } else if (newPassword !== confirmNewPassword) {
        showToast("Passwords do not match", "error")
      } else {
        showToast("Password must be at least 6 characters", "error")
      }
    }
  }

  const resetForgotPasswordModal = () => {
    setForgotPasswordModalVisible(false)
    setForgotPasswordStep(1)
    setForgotEmail("")
    setOtp(["", "", "", "", ""])
    setNewPassword("")
    setConfirmNewPassword("")
  }

  const handleResendOTP = async () => {
    if (!forgotEmail) return
    try {
      const response = await fetch("http://10.205.240.128:3000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      })

      const data = await response.json()

      if (!response.ok) {
        showToast(data.message || "Failed to resend OTP", "error")
        return
      }

      showToast("OTP resent to your email!", "info")
      setOtp(["", "", "", "", ""])
      if (otpInputRefs.current[0]) {
        otpInputRefs.current[0].focus()
      }
    } catch (error) {
      showToast("Network error", "error")
    }
  }

  const renderForgotPasswordContent = () => {
    switch (forgotPasswordStep) {
      case 1:
        return (
          <>
            <Text style={styles.modalTitle}>Forgot Password</Text>
            <Text style={styles.modalSubtitle}>Enter your email address to receive OTP</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter your email"
              value={forgotEmail}
              placeholderTextColor="#888"
              onChangeText={setForgotEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </>
        )
      case 2:
        return (
          <>
            <Text style={styles.modalTitle}>Verify OTP</Text>
            <Text style={styles.modalSubtitle}>Enter the 5-digit code sent to {forgotEmail}</Text>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (otpInputRefs.current[index] = ref)}
                  placeholderTextColor="#888"
                  style={[styles.otpBox, focusedOtpIndex === index && styles.otpBoxFocused]}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  onKeyPress={(e) => handleOtpKeyPress(e, index)}
                  onFocus={() => setFocusedOtpIndex(index)}
                  onBlur={() => setFocusedOtpIndex(null)}
                />
              ))}
            </View>
            <TouchableOpacity style={styles.resendButton} onPress={handleResendOTP}>
              <Text style={styles.resendText}>Didn't receive code? Resend</Text>
            </TouchableOpacity>
          </>
        )
      case 3:
        return (
          <>
            <Text style={styles.modalTitle}>Set New Password</Text>
            <Text style={styles.modalSubtitle}>Create a new password for your account</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="New Password"
                placeholderTextColor="#888"
                secureTextEntry={!showNewPassword}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                <Ionicons name={showNewPassword ? "eye" : "eye-off"} size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Confirm New Password"
                placeholderTextColor="#888"
                secureTextEntry={!showConfirmNewPassword}
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
                <Ionicons name={showConfirmNewPassword ? "eye" : "eye-off"} size={20} color="#666" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => setForgotPasswordStep(2)}
              style={{ marginTop: 10, alignSelf: "flex-start" }}
            >
              <Text style={{ color: "#4A90E2", fontWeight: "bold" }}>← Back to OTP</Text>
            </TouchableOpacity>
          </>
        )
    }
  }

  const getSubmitButtonText = () => {
    switch (forgotPasswordStep) {
      case 1:
        return "Send OTP"
      case 2:
        return "Verify OTP"
      case 3:
        return "Reset Password"
      default:
        return "Submit"
    }
  }

  const isSubmitDisabled = () => {
    switch (forgotPasswordStep) {
      case 1:
        return !forgotEmail
      case 2:
        return otp.join("").length < 5
      case 3:
        return !newPassword || !confirmNewPassword || newPassword !== confirmNewPassword
      default:
        return true
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFBFC" }}>
      <KeyboardAvoidingView
        style={{ flex: 1, padding: 24, backgroundColor: "#FAFBFC" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Image source={require("../assets/icon.png")} style={styles.logoImage} resizeMode="contain" />
          </View>

          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>Welcome Back!</Text>
            <Text style={styles.welcomeSubtitle}>Ready to step up your style? Log in now!</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputContainer, focusedInput === "email" && styles.inputContainerFocused]}>
              <View style={styles.inputIcon}>
                <Ionicons name="person-outline" size={20} color="#4A90E2" />
              </View>
              <TextInput
                placeholder="Enter your Email"
                style={styles.input}
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#888"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => passwordRef.current?.focus()}
                onFocus={() => setFocusedInput("email")}
                onBlur={() => setFocusedInput("")}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputContainer, focusedInput === "password" && styles.inputContainerFocused]}>
              <View style={styles.inputIcon}>
                <Ionicons name="lock-closed-outline" size={20} color="#4A90E2" />
              </View>
              <TextInput
                ref={passwordRef}
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                style={styles.input}
                value={password}
                placeholderTextColor="#888"
                onChangeText={setPassword}
                returnKeyType="done"
                onFocus={() => setFocusedInput("password")}
                onBlur={() => setFocusedInput("")}
              />
              <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.forgotContainer}>
            <TouchableOpacity style={styles.forgotButton} onPress={() => setForgotPasswordModalVisible(true)}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, isButtonDisabled && styles.loginButtonDisabled]}
            onPress={async () => {
              if (isButtonDisabled) return
              try {
                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email, password }),
                })

                const data = await response.json()

                if (!response.ok) {
                  showToast(data.message || "Login failed", "error")
                  if (response.status === 403) {
                    setTimeout(() => {
                      navigation.navigate("OtpScreen", { email })
                    }, 1000)
                  }
                  return
                }

                showToast("Login successful!", "success")
                await AsyncStorage.setItem('token', data.token);
                await fetchProfile();
                setTimeout(() => {
                  navigation.replace("MainTabs")
                }, 1000)
              } catch (error) {
                showToast("Network error", "error")
              }
            }}
            activeOpacity={isButtonDisabled ? 1 : 0.8}
            disabled={isButtonDisabled}
          >
            <Text style={styles.loginButtonText}>Login</Text>
            <View style={styles.buttonIcon}>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 16 }}>
            <Text style={{ fontSize: 14, color: "#888" }}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={{ fontSize: 14, fontWeight: "bold", color: "#4A90E2" }}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={forgotPasswordModalVisible}
        onRequestClose={resetForgotPasswordModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {renderForgotPasswordContent()}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={resetForgotPasswordModal}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitButton, isSubmitDisabled() && styles.submitButtonDisabled]}
                onPress={handleForgotPasswordSubmit}
                disabled={isSubmitDisabled()}
              >
                <Text style={styles.submitButtonText}>{getSubmitButtonText()}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        duration={toast.duration}
        onHide={hideToast}
      />
    </SafeAreaView>
  )
}
