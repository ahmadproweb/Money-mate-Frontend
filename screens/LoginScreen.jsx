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
import styles from "../css/LoginScreen"

export default function LoginScreen({ navigation }) {
  const [showPassword, setShowPassword] = useState(false)
  const [focusedInput, setFocusedInput] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const passwordRef = useRef(null)

  // Toast hook
  const { toast, showToast, hideToast } = useToast()

  // Forgot Password Modal States
  const [forgotPasswordModalVisible, setForgotPasswordModalVisible] = useState(false)
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1) // 1: Email, 2: OTP, 3: New Password
  const [forgotEmail, setForgotEmail] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", ""])
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [focusedOtpIndex, setFocusedOtpIndex] = useState(null)

  const otpInputRefs = useRef([])

  const isButtonDisabled = !email || !password

  // OTP Handling Functions
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

  // Forgot Password Flow Functions
  const handleForgotPasswordSubmit = () => {
    if (forgotPasswordStep === 1) {
      // Send OTP to email
      if (forgotEmail) {
        console.log("Sending OTP to:", forgotEmail)
        showToast("OTP sent to your email!", "success")
        setForgotPasswordStep(2)
      } else {
        showToast("Please enter your email address", "error")
      }
    } else if (forgotPasswordStep === 2) {
      // Verify OTP
      const otpCode = otp.join("")
      if (otpCode.length === 5) {
        console.log("Verifying OTP:", otpCode)
        showToast("OTP verified successfully!", "success")
        setForgotPasswordStep(3)
      } else {
        showToast("Please enter complete OTP", "error")
      }
    } else if (forgotPasswordStep === 3) {
      // Set new password
      if (newPassword === confirmNewPassword && newPassword.length >= 6) {
        console.log("Password reset successful")
        showToast("Password reset successfully!", "success")
        resetForgotPasswordModal()
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

  const handleResendOTP = () => {
    showToast("OTP resent to your email!", "info")
    // Reset OTP inputs
    setOtp(["", "", "", "", ""])
    if (otpInputRefs.current[0]) {
      otpInputRefs.current[0].focus()
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
            <TextInput
              style={styles.modalInput}
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Confirm New Password"
              secureTextEntry
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
            />
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
      {/* Toast Component */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        duration={toast.duration}
        onHide={hideToast}
      />

      <KeyboardAvoidingView
        style={{ flex: 1, padding: 24, backgroundColor: "#FAFBFC" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo Image */}
          <View style={styles.logoContainer}>
            <Image source={require("../assets/icon.png")} style={styles.logoImage} resizeMode="contain" />
          </View>

          {/* Welcome Text */}
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>Welcome Back!</Text>
            <Text style={styles.welcomeSubtitle}>Ready to step up your style? Log in now!</Text>
            <Text style={styles.welcomeSubtitle}>Access your account to explore exclusive features.</Text>
          </View>

          {/* Email */}
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
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => passwordRef.current?.focus()}
                onFocus={() => setFocusedInput("email")}
                onBlur={() => setFocusedInput("")}
              />
            </View>
          </View>

          {/* Password */}
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

          {/* Forgot Password */}
          <View style={styles.forgotContainer}>
            <TouchableOpacity style={styles.forgotButton} onPress={() => setForgotPasswordModalVisible(true)}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, isButtonDisabled && styles.loginButtonDisabled]}
            onPress={() => {
              if (!isButtonDisabled) {
                showToast("Login successful!", "success")
                setTimeout(() => {
                  navigation.replace("MainTabs")
                }, 1000)
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
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Forgot Password Modal */}
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
    </SafeAreaView>
  )
}

