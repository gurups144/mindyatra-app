import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from 'expo-auth-session';
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useState } from "react";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../components/Button";
import { authService } from "../services/auth";
import { COLORS, SIZES } from "../utils/constants";
import { validateEmail } from "../utils/validation";
// import * as AuthSession from 'expo-auth-session';

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
    console.log("Backend response:", data);

    if (data.success) {
      // Save session info locally
      await AsyncStorage.setItem("user_id", data.user_id.toString());
      await AsyncStorage.setItem("email", data.email);
      await AsyncStorage.setItem("token", data.token);

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
    setErrors({ email: "Please enter a valid email address" });
    return;
  }

  setLoading(true);
  try {
    const formData = new FormData();
    formData.append("email", email);

    const res = await fetch("https://mindyatra.in/Api/sendmail_otp_host_login", {
      method: "POST",
      body: formData,
    });

    const result = await res.text();
    console.log("OTP Response:", result);

    if (result === "1") {
      Alert.alert("OTP Sent", "Please check your email for the OTP.");
      setStep(2);
    } else if (result === "3") {
      Alert.alert("Email Not Registered", "This email is not found.");
    } else {
      Alert.alert("Error", "Failed to send OTP, try again.");
    }
  } catch (err) {
    console.error(err);
    Alert.alert("Error", "Network error");
  } finally {
    setLoading(false);
  }
};


const handleVerifyOTP = async () => {
  if (!otp || otp.length !== 6) {
    setErrors({ otp: "Please enter a valid 6-digit OTP" });
    return;
  }

  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("otp", otp);

    const res = await fetch("https://mindyatra.in/Api/verify_otp", {
      method: "POST",
      body: formData,
    });

    const result = await res.json(); // expecting {success:true, user_id, email, token}
    console.log("Verify Response:", result);

    if (result.success) {
      await AsyncStorage.setItem("user_id", result.user_id.toString());
      await AsyncStorage.setItem("email", result.email);
      await AsyncStorage.setItem("token", result.token);

      navigation.replace("MainTabs");
    } else {
      Alert.alert("Invalid OTP", "Incorrect code, try again");
    }
  } catch (err) {
    console.error(err);
    Alert.alert("Error", "Network error");
  } finally {
    setLoading(false);
  }
};


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name="brain" size={80} color={COLORS.primary} />
          <Text style={styles.title}>MindYatra</Text>
          <Text style={styles.subtitle}>Your Mental Wellness Journey</Text>
        </View>

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

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity
              style={styles.googleButton}
              onPress={() => promptAsync()}
              disabled={!request || loading}
            >
              <Ionicons name="logo-google" size={20} color="#DB4437" />
              <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </TouchableOpacity>
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
                <Text style={styles.termsLink}>Terms and Conditions</Text> and{" "}
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
              title={isNewUser ? "Create Account" : "Login"}
              onPress={handleVerifyOTP}
              loading={loading}
              style={styles.loginButton}
            />

            <TouchableOpacity
              style={styles.resendContainer}
              onPress={() => {
                const otpCode = Math.floor(
                  100000 + Math.random() * 900000
                ).toString();
                setGeneratedOTP(otpCode);
                Alert.alert("OTP Sent", `Your new OTP is: ${otpCode}`);
                console.log("New OTP:", otpCode);
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
    alignItems: "center",
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: SIZES.h1,
    fontWeight: "bold",
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
    fontWeight: "bold",
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
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "600",
  },
  otpContainer: {
    marginTop: SIZES.padding,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: SIZES.padding * 2,
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
