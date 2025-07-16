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
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from "../css/OtpScreen"

import { Ionicons } from '@expo/vector-icons';

export default function OtpVerificationScreen({ navigation }) {
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState(null);

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

  const handleContinue = () => {
    const code = otp.join('');
    if (code.length === 5) {
      console.log('OTP:', code);
      navigation.navigate('Home');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFBFC' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo Image */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/icon.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* Headings */}
          <Text style={styles.heading}>Verify OTP</Text>
          <Text style={styles.subText}>Enter the 5-digit code sent to your email</Text>

          {/* OTP Boxes */}
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

          {/* Resend */}
          <TouchableOpacity style={styles.resend}>
            <Text style={styles.resendText}>Didn’t receive code? Resend</Text>
          </TouchableOpacity>

          {/* Continue */}
          <TouchableOpacity
            style={[
              styles.continueButton,
              otp.join('').length < 5 && { opacity: 0.5 },
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


