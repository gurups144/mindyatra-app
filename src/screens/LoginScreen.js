import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import { COLORS, SIZES } from '../utils/constants';
import { validateEmail } from '../utils/validation';
import { authService } from '../services/auth';

const LoginScreen = ({ navigation }) => {
  const [step, setStep] = useState(1); // 1: Email input, 2: OTP verification
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generatedOTP, setGeneratedOTP] = useState('');

  const handleContinue = () => {
    // Validate email
    if (!validateEmail(email)) {
      setErrors({ email: 'Please enter a valid Gmail address' });
      return;
    }

    // Check if it's a Gmail address
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      setErrors({ email: 'Please use a Gmail address only' });
      return;
    }

    // For UI demo - assume new user, show terms
    setIsNewUser(true);
    setStep(1.5);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    
    try {
      // TODO: Implement actual Google OAuth
      // For now, simulate Google login
      Alert.alert(
        'Google Sign In',
        'This would open Google authentication.\n\nFor demo: Enter your Gmail:',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => setLoading(false) },
          {
            text: 'Continue',
            onPress: async () => {
              // Simulate Google providing email
              const mockGoogleEmail = 'user@gmail.com';
              const result = await authService.loginWithGmail(mockGoogleEmail);
              setLoading(false);
              
              if (result.success) {
                navigation.replace('MainTabs');
              } else {
                Alert.alert('Error', 'Failed to sign in with Google');
              }
            }
          }
        ]
      );
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Google Sign-In failed');
    }
  };

  const handleSendOTP = () => {
    if (!agreedToTerms) {
      Alert.alert('Agreement Required', 'Please agree to Terms and Conditions');
      return;
    }

    // Generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(otpCode);
    Alert.alert('OTP Sent', `Your OTP is: ${otpCode}`);
    console.log('Demo OTP:', otpCode);
    setStep(2);
  };

  const handleVerifyOTP = async () => {
    console.log('handleVerifyOTP called');
    console.log('OTP entered:', otp);
    console.log('Generated OTP:', generatedOTP);
    
    if (!otp || otp.length !== 6) {
      setErrors({ otp: 'Please enter a valid 6-digit OTP' });
      return;
    }

    if (otp !== generatedOTP) {
      Alert.alert('Invalid OTP', 'Please enter the correct OTP');
      return;
    }

    setLoading(true);
    console.log('Loading set to true');
    
    try {
      // Create account
      console.log('Calling registerWithGmail...');
      const result = await authService.registerWithGmail(email);
      console.log('Registration result:', result);
      
      setLoading(false);
      console.log('Loading set to false');
      
      if (result && result.success) {
        console.log('Registration successful, navigating to MainTabs...');
        setTimeout(() => {
          navigation.replace('MainTabs');
        }, 100);
      } else {
        Alert.alert('Error', result?.error || 'Failed to create account');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setLoading(false);
      Alert.alert('Error', 'Something went wrong: ' + error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="brain" size={80} color={COLORS.primary} />
          <Text style={styles.title}>MindYatra</Text>
          <Text style={styles.subtitle}>Your Mental Wellness Journey</Text>
        </View>

        {/* Step 1: Email Input */}
        {step === 1 && (
          <View style={styles.form}>
            <Text style={styles.formTitle}>Login / Sign Up</Text>
            <Text style={styles.formSubtitle}>Enter your Gmail to continue</Text>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="your.email@gmail.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrors({ ...errors, email: null });
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <Button 
              title="Continue" 
              onPress={handleContinue} 
              loading={loading}
              style={styles.loginButton}
            />

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity 
              style={styles.googleButton}
              onPress={handleGoogleSignIn}
              disabled={loading}
            >
              <Ionicons name="logo-google" size={20} color="#DB4437" />
              <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </TouchableOpacity>

            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={20} color={COLORS.info} />
              <Text style={styles.infoText}>
                Gmail addresses only. Manual entry requires OTP verification.
              </Text>
            </View>
          </View>
        )}

        {/* Step 1.5: Terms and Conditions for New Users */}
        {step === 1.5 && (
          <View style={styles.form}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setStep(1)}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>

            <Text style={styles.formTitle}>Welcome to MindYatra!</Text>
            <Text style={styles.formSubtitle}>You're signing up as a new user</Text>

            <View style={styles.emailDisplay}>
              <Ionicons name="mail" size={20} color={COLORS.primary} />
              <Text style={styles.emailDisplayText}>{email}</Text>
            </View>

            <View style={styles.termsContainer}>
              <TouchableOpacity 
                style={styles.checkbox}
                onPress={() => setAgreedToTerms(!agreedToTerms)}
              >
                <Ionicons 
                  name={agreedToTerms ? "checkbox" : "square-outline"} 
                  size={24} 
                  color={agreedToTerms ? COLORS.primary : COLORS.gray} 
                />
              </TouchableOpacity>
              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text style={styles.termsLink}>Terms and Conditions</Text>
                {' '}and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>

            <Button 
              title="Send OTP" 
              onPress={handleSendOTP} 
              loading={loading}
              disabled={!agreedToTerms}
              style={styles.loginButton}
            />
          </View>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <View style={styles.form}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setStep(isNewUser ? 1.5 : 1)}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>

            <Text style={styles.formTitle}>Verify OTP</Text>
            <Text style={styles.formSubtitle}>
              We've sent a 6-digit code to{'\n'}{email}
            </Text>

            <View style={styles.otpContainer}>
              <View style={styles.inputContainer}>
                <Ionicons name="key-outline" size={20} color={COLORS.gray} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChangeText={(text) => {
                    setOtp(text);
                    setErrors({ ...errors, otp: null });
                  }}
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>
              {errors.otp && <Text style={styles.errorText}>{errors.otp}</Text>}
            </View>

            <Button 
              title={isNewUser ? "Create Account" : "Login"} 
              onPress={handleVerifyOTP} 
              loading={loading}
              style={styles.loginButton}
            />

            <TouchableOpacity 
              style={styles.resendContainer}
              onPress={() => {
                const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
                setGeneratedOTP(otpCode);
                Alert.alert('OTP Sent', `Your new OTP is: ${otpCode}`);
                console.log('New OTP:', otpCode);
              }}
            >
              <Text style={styles.resendText}>Didn't receive the code? </Text>
              <Text style={styles.resendLink}>Resend OTP</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SIZES.padding * 2,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: SIZES.h1,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: SIZES.padding,
  },
  subtitle: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    marginTop: SIZES.base,
  },
  form: {
    flex: 1,
  },
  formTitle: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SIZES.base,
  },
  formSubtitle: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    marginBottom: SIZES.padding * 2,
  },
  backButton: {
    marginBottom: SIZES.padding,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  inputIcon: {
    marginRight: SIZES.base,
  },
  input: {
    flex: 1,
    paddingVertical: SIZES.padding,
    fontSize: SIZES.medium,
    color: COLORS.dark,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: SIZES.small,
    marginTop: -SIZES.base,
    marginBottom: SIZES.base,
    marginLeft: SIZES.base,
  },
  loginButton: {
    marginTop: SIZES.padding,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SIZES.padding * 2,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.lightGray,
  },
  dividerText: {
    marginHorizontal: SIZES.padding,
    fontSize: SIZES.medium,
    color: COLORS.gray,
    fontWeight: '600',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    paddingVertical: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  googleButtonText: {
    fontSize: SIZES.medium,
    color: COLORS.dark,
    fontWeight: '600',
    marginLeft: SIZES.base,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.info + '20',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginTop: SIZES.padding * 2,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: SIZES.font,
    color: COLORS.gray,
    marginLeft: SIZES.base,
    lineHeight: 20,
  },
  emailDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '20',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding * 2,
  },
  emailDisplayText: {
    fontSize: SIZES.medium,
    color: COLORS.dark,
    marginLeft: SIZES.base,
    fontWeight: '500',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.padding,
  },
  checkbox: {
    marginRight: SIZES.base,
  },
  termsText: {
    flex: 1,
    fontSize: SIZES.medium,
    color: COLORS.gray,
    lineHeight: 22,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  otpContainer: {
    marginTop: SIZES.padding,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.padding * 2,
  },
  resendText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  resendLink: {
    fontSize: SIZES.medium,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default LoginScreen;
