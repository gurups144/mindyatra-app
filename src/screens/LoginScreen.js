import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from 'expo-auth-session';
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";
import { Image } from 'react-native';

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Button from "../components/Button";
import { authService } from "../services/auth";
import { COLORS, SIZES } from "../utils/constants";
import { validateEmail } from "../utils/validation";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
  const [step, setStep] = useState(1); // 1: Email input, 2: OTP verification
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generatedOTP, setGeneratedOTP] = useState("");

  // Google Auth
  const [request, response, promptAsync] = Google.useAuthRequest({
  expoClientId:
    "352100689801-rt7u1870kuo79rvvhig175l6gab1o7re.apps.googleusercontent.com",
  webClientId:
    "352100689801-rt7u1870kuo79rvvhig175l6gab1o7re.apps.googleusercontent.com",
    androidClientId: "352100689801-rt7u1870kuo79rvvhig175l6gab1o7re.apps.googleusercontent.com",
    responseType: "id_token",
  scopes: ["openid", "email", "profile"],
  redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
});

console.log('Redirect URI:', AuthSession.makeRedirectUri({ useProxy: true }));

useEffect(() => {
  if (response?.type === "success") {
    const idToken = response.params?.id_token;
    if (idToken) {
      sendTokenToBackend(idToken);
    }
  }
}, [response]);

  const handleGoogleSignIn = async (accessToken) => {
    try {
      setLoading(true);
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const userInfo = await userInfoResponse.json();

      // Check if user exists or create new account
      const result = await authService.loginWithGmail(userInfo.email);

      if (result.success) {
        navigation.replace("MainTabs");
      } else {
        Alert.alert("Error", "Failed to sign in with Google");
      }
    } catch (error) {
      console.error("Google Sign In Error:", error);
      Alert.alert("Error", "Google Sign-In failed");
    } finally {
      setLoading(false);
    }
  };
  

const sendTokenToBackend = async (idToken) => {
  try {
    setLoading(true);

    const res = await fetch("https://mindyatra.in/Api/google_callback", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `credential=${encodeURIComponent(idToken)}`,
    });

    const data = await res.json();
    // alert("Backend response:", data);

    if (data.success) {
      // Save session info locally
      await AsyncStorage.setItem("user_id", data.user_id);
      await AsyncStorage.setItem("email", data.email);
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("paid_status",data.paid_status);

      navigation.replace("MainTabs");
    } else {
      Alert.alert("Login Failed", data.error);
    }

  } catch (err) {
    console.error("Error:", err);
    Alert.alert("Error", "Login failed");
  } finally {
    setLoading(false);
  }
};



  const handleContinue = () => {
    if (!validateEmail(email)) {
      setErrors({ email: "Please enter a valid Gmail address" });
      return;
    }

    if (!email.toLowerCase().endsWith("@gmail.com")) {
      setErrors({ email: "Please use a Gmail address only" });
      return;
    }

    setIsNewUser(true);
    setStep(1.5);
  };

const handleSendOTP = async () => {
  if (!validateEmail(email)) {
    setErrors({ email: "Please enter a valid email" });
    return;
  }

  setLoading(true);
  try {
    const res = await fetch("https://mindyatra.in/Api/sendmail_otp_host_login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `email=${encodeURIComponent(email)}`,
    });

    const resultText = await res.text();

    // Print the full backend output, including PHP errors or notices
    console.log("Backend full response:", resultText);
    // Alert.alert("Backend Response", resultText); // <-- shows it in the app too

    // You can still do your checks if needed
    if (resultText === "1") {
      Alert.alert("OTP Sent", "Check your email for the OTP");
      setStep(2);
    } 
    else if (resultText === "3") {
      Alert.alert("Email Not Found", "This email is not registered");
    } 
    else {
      Alert.alert("Error", "Failed to send OTP. See backend response");
    }
  } catch (error) {
    console.log("Fetch error:", error);
    Alert.alert("Error", "Unable to send OTP. Check console for details");
  } finally {
    setLoading(false);
  }
};




const handleVerifyOTP = async () => {
  if (!otp || otp.length !== 6) {
    setErrors({ otp: "Enter a valid 6-digit OTP" });
    return;
  }

  setLoading(true);

  try {
const res = await fetch("https://mindyatra.in/Api/verify_otp_email", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: `email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`,
});

const data = await res.json();

if (data.success) {
  await AsyncStorage.setItem("user_id", String(data.user_id));
  await AsyncStorage.setItem("email", data.email);
  await AsyncStorage.setItem("paid_status", String(data.paid_status));

  navigation.replace("MainTabs");
} else {
  Alert.alert("Invalid OTP", data.message || "OTP verification failed");
}
  } catch (error) {
    console.log(error);
    Alert.alert("Error", "Unable to verify OTP");
  } finally {
    setLoading(false);
  }
};



  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.contentWrapper}>
          {/* Header with Logo */}
          <View style={styles.header}>
            <Image 
              source={require('../../assets/images/logo_new.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>MindYatra</Text>
            <Text style={styles.subtitle}>Your Mental Wellness Journey</Text>
          </View>

          {/* Form Sections */}
          <View style={styles.formContainer}>
            {step === 1 && (
              <View style={styles.form}>
                <Text style={styles.formTitle}>Login / Sign Up</Text>
                <Text style={styles.formSubtitle}>
                  Enter your Gmail to continue
                </Text>

                <View style={styles.inputContainer}>
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={COLORS.gray}
                    style={styles.inputIcon}
                  />
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
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                <Button
                  title="Continue"
                  onPress={handleContinue}
                  loading={loading}
                  style={styles.loginButton}
                />
              </View>
            )}

            {step === 1.5 && (
              <View style={styles.form}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setStep(1)}
                >
                  <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                </TouchableOpacity>

                <Text style={styles.formTitle}>Welcome to MindYatra!</Text>
                <Text style={styles.formSubtitle}>
                  You're signing up as a new user
                </Text>

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
                    I agree to the{" "}
                    <TouchableOpacity
                      onPress={() => navigation.navigate('TermsConditions')}
                    >
                      <Text style={styles.termsLink}>
                        Terms and Conditions
                      </Text>
                    </TouchableOpacity>{" "}
                    and{" "}
                    <TouchableOpacity
                      onPress={() => navigation.navigate('PrivacyPolicy')}
                    >
                      <Text style={styles.termsLink}>
                        Privacy Policy
                      </Text>
                    </TouchableOpacity>
                  </Text>
                </View>

                {/* <View style={styles.termsButtonsContainer}>
                  <TouchableOpacity
                    style={styles.termsButton}
                    onPress={() => navigation.navigate('TermsConditions')}
                  >
                    <Text style={styles.termsButtonText}>View Terms & Conditions</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.termsButton}
                    onPress={() => navigation.navigate('PrivacyPolicy')}
                  >
                    <Text style={styles.termsButtonText}>View Privacy Policy</Text>
                  </TouchableOpacity>
                </View> */}

                <Button
                  title="Send OTP"
                  onPress={handleSendOTP}
                  loading={loading}
                  disabled={!agreedToTerms}
                  style={styles.loginButton}
                />
              </View>
            )}

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
                  We've sent a 6-digit code to{"\n"}
                  {email}
                </Text>

                <View style={styles.otpContainer}>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="key-outline"
                      size={20}
                      color={COLORS.gray}
                      style={styles.inputIcon}
                    />
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
                  title={isNewUser ? "Login" : "Login"}
                  onPress={handleVerifyOTP}
                  loading={loading}
                  style={styles.loginButton}
                />

                <TouchableOpacity
                  style={styles.resendContainer}
                  onPress={async () => {
                    try {
                      setLoading(true);

                      const res = await fetch(
                        "https://mindyatra.in/Api/sendmail_otp_host_login",
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/x-www-form-urlencoded" },
                          body: `email=${encodeURIComponent(email)}`,
                        }
                      );

                      const result = await res.text();

                      if (result === "1") {
                        Alert.alert("OTP Sent", "A new OTP has been sent to your email.");
                      } else if (result === "3") {
                        Alert.alert("Email Not Found", "This email does not exist.");
                      } else {
                        Alert.alert("Error", "Failed to resend OTP.");
                      }
                    } catch (error) {
                      console.log("Resend OTP Error:", error);
                      Alert.alert("Error", "Unable to resend OTP");
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  <Text style={styles.resendText}>Didn't receive the code? </Text>
                  <Text style={styles.resendLink}>Resend OTP</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
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
    justifyContent: 'center',
    minHeight: '100%',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    padding: SIZES.padding * 2,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  logo: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: COLORS.primary,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: SIZES.h1 * 1.2,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  form: {
    width: '100%',
  },
  formTitle: {
    fontSize: SIZES.h2,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: SIZES.base,
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    marginBottom: SIZES.padding * 2,
    textAlign: 'center',
    lineHeight: 22,
  },
  backButton: {
    marginBottom: SIZES.padding,
    padding: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    height: 56,
  },
  inputIcon: {
    marginRight: SIZES.base,
  },
  input: {
    flex: 1,
    paddingVertical: SIZES.padding,
    fontSize: SIZES.medium,
    color: COLORS.dark,
    height: '100%',
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
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "600",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    paddingVertical: SIZES.padding,
    marginBottom: SIZES.padding,
    height: 56,
  },
  googleButtonText: {
    fontSize: SIZES.medium,
    color: COLORS.dark,
    fontWeight: "600",
    marginLeft: SIZES.base,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: COLORS.info + "20",
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginTop: SIZES.padding * 2,
    alignItems: "center",
  },
  infoText: {
    flex: 1,
    fontSize: SIZES.font,
    color: COLORS.gray,
    marginLeft: SIZES.base,
    lineHeight: 20,
  },
  emailDisplay: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary + "20",
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding * 2,
  },
  emailDisplayText: {
    fontSize: SIZES.medium,
    color: COLORS.dark,
    marginLeft: SIZES.base,
    fontWeight: "500",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SIZES.padding,
    paddingHorizontal: SIZES.base,
  },
  checkbox: {
    marginRight: SIZES.base,
    marginTop: 2,
  },
  termsText: {
    flex: 1,
    fontSize: SIZES.medium,
    color: COLORS.gray,
    lineHeight: 22,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  termsButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.padding,
    gap: SIZES.base,
  },
  termsButton: {
    flex: 1,
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.base,
    alignItems: 'center',
  },
  termsButtonText: {
    fontSize: SIZES.small,
    color: COLORS.primary,
    fontWeight: '500',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  otpContainer: {
    marginTop: SIZES.padding,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: SIZES.padding * 2,
    paddingVertical: SIZES.base,
  },
  resendText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  resendLink: {
    fontSize: SIZES.medium,
    color: COLORS.primary,
    fontWeight: "600",
  },
});

export default LoginScreen;