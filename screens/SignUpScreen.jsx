import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from "../css/SignUpScreen"
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toast } from "../components/Toast"
import { useToast } from "../hooks/useToast";
import { useLoading } from '../context/LoadingContext';

export default function SignupScreen({ navigation, route }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState('');
  const { toast, showToast, hideToast } = useToast()
  const { showLoader, hideLoader } = useLoading();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const isButtonDisabled = !email || !password || !confirmPassword;


  const handleSignup = async () => {
    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    showLoader();
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast(data.message, "success");
        navigation.navigate('OtpScreen', { email });
      } else {
        showToast(data.message || "Signup failed.", "error");

        if (data.message === "Email is already in use.") {
          setTimeout(() => {
            navigation.navigate("Login", { email });
          }, 2000);
        }
      }
    } catch (error) {
      showToast("Network error. Please try again.", "error");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    if (route.params?.email) {
      setEmail(route.params.email);
    }
  }, [route.params]);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFBFC' }}>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        duration={toast.duration}
        onHide={hideToast}
      />
      <KeyboardAvoidingView
        style={{ flex: 1, padding: 24 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'android' ? 50 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/icon.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>Create Account</Text>
            <Text style={styles.welcomeSubtitle}>Join us and unlock all features.</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputContainer, focusedInput === 'email' && styles.inputContainerFocused]}>
              <View style={styles.inputIcon}>
                <Ionicons name="mail-outline" size={20} color="#4A90E2" />
              </View>
              <TextInput
                placeholder="Enter your Email"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => passwordRef.current?.focus()}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput('')}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputContainer, focusedInput === 'password' && styles.inputContainerFocused]}>
              <View style={styles.inputIcon}>
                <Ionicons name="lock-closed-outline" size={20} color="#4A90E2" />
              </View>
              <TextInput
                ref={passwordRef}
                placeholder="Enter password"
                secureTextEntry={!showPassword}
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput('')}
              />
              <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={[styles.inputContainer, focusedInput === 'confirm' && styles.inputContainerFocused]}>
              <View style={styles.inputIcon}>
                <Ionicons name="lock-closed-outline" size={20} color="#4A90E2" />
              </View>
              <TextInput
                ref={confirmPasswordRef}
                placeholder="Re-enter password"
                secureTextEntry={!showConfirmPassword}
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                returnKeyType="done"
                onFocus={() => setFocusedInput('confirm')}
                onBlur={() => setFocusedInput('')}
              />
              <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons name={showConfirmPassword ? 'eye' : 'eye-off'} size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, isButtonDisabled && styles.loginButtonDisabled]}

            onPress={handleSignup}
            activeOpacity={isButtonDisabled ? 1 : 0.8}
            disabled={isButtonDisabled}
          >
            <Text style={styles.loginButtonText}>Sign Up</Text>
            <View style={styles.buttonIcon}>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 16 }}>
            <Text style={{ fontSize: 14, color: "#888" }}>Do You have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={{ fontSize: 14, fontWeight: "bold", color: "#4A90E2" }}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


