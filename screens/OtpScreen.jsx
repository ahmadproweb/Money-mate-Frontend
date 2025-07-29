import React, { useRef, useState } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from "../css/OtpScreen";
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useToast } from '../hooks/useToast';
import { Toast } from '../components/Toast';
import { useUser } from "../context/UserContext";
import { useLoading } from '../context/LoadingContext';

export default function OtpVerificationScreen({ navigation, route }) {
  const { email } = route.params;
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const { fetchProfile } = useUser();
  const { toast, showToast, hideToast } = useToast();
    const { showLoader, hideLoader } = useLoading();
  
  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleContinue = async () => {
    const code = otp.join('');

    if (code.length < 5) {
      showToast('Please enter full OTP code', 'error');
      return;
    }
    showLoader();

    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/verify`, {
        email,
        code
      });

      showToast(response.data.message, 'success');
      await AsyncStorage.setItem('token', response.data.token);
      await fetchProfile();
      setTimeout(() => {
        navigation.replace('MainTabs');
      }, 1000);

    } catch (error) {
      const message = error?.response?.data?.message || 'Verification failed';
      showToast(message, 'error');
    } finally {
      hideLoader();
    }
  };
  const handleResendOtp = async () => {
    showLoader();
    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/resend`, { email });
      showToast(response.data.message, 'success');
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to resend OTP';
      showToast(message, 'error');
    } finally {
      hideLoader();
    }
  };

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
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/icon.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.heading}>Verify OTP</Text>
          <Text style={styles.subText}>Enter the 5-digit code sent to:</Text>
          <Text style={[styles.subText, { fontWeight: 'bold' }]}>{email}</Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.otpBox,
                  focusedIndex === index && styles.otpBoxFocused,
                ]}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.resend} onPress={handleResendOtp}>
            <Text style={styles.resendText}>Didn’t receive code? Resend</Text>
          </TouchableOpacity>


          <TouchableOpacity
            style={[
              styles.continueButton,
              otp.join('').length < 5 && { opacity: 0.5, backgroundColor: '#9CA3AF' },
            ]}
            onPress={handleContinue}
            disabled={otp.join('').length < 5}
          >
            <Text style={styles.buttonText}>Continue</Text>
            <View style={styles.buttonIcon}>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
