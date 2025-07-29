import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import styles from "../css/SplashScreen";
import { useUser } from '../context/UserContext';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { Linking } from 'react-native';

export default function SplashScreen({ navigation }) {
  const { profile, loading } = useUser();

  useEffect(() => {
    if (!loading) {
      if (profile) {
        navigation.replace('MainTabs');
      }
    }
  }, [loading, profile]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Money Mate</Text>
        <View style={styles.logoWrapper}>
          <Image
            source={require('../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <ActivityIndicator size="large" color="#4A90E2" style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Money Mate</Text>

      <View style={styles.logoWrapper}>
        <Image
          source={require('../assets/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signupText}>Sign Up</Text>
        </TouchableOpacity>
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

    </SafeAreaView>
  );
}
