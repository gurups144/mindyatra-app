import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const EditProfileScreen = ({ navigation, route }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setInitialLoad(true);
      const [savedName, savedEmail, savedUserId] = await Promise.all([
        AsyncStorage.getItem("name"),
        AsyncStorage.getItem("email"),
        AsyncStorage.getItem("user_id")
      ]);
      
      setName(savedName || "");
      setEmail(savedEmail || "");
      setUserId(savedUserId || "");
      
      console.log("Loaded user:", { 
        name: savedName, 
        email: savedEmail, 
        userId: savedUserId 
      });
    } catch (error) {
      console.error("Error loading user:", error);
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setInitialLoad(false);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSave = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert("Error", "Name is required");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Error", "Email is required");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    if (!userId) {
      Alert.alert("Error", "User ID not found. Please login again.");
      return;
    }

    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('user_id', userId.toString());
      formData.append('name', name.trim());
      formData.append('email', email.trim());

      console.log("Sending update with:", { 
        userId: userId.toString(), 
        name: name.trim(), 
        email: email.trim() 
      });

      const response = await fetch("https://mindyatra.in/Api/update_profile", {
        method: "POST",
        headers: { 
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json"
        },
        body: formData.toString(),
        timeout: 10000 // 10 second timeout
      });

      console.log("Response status:", response.status);
      
      const responseText = await response.text();
      console.log("Raw response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);
        throw new Error("Invalid server response");
      }

      if (data.success) {
        // Save locally
        await Promise.all([
          AsyncStorage.setItem("name", name.trim()),
          AsyncStorage.setItem("email", email.trim())
        ]);
        
        Alert.alert("Success", "Profile updated successfully", [
          {
            text: "OK",
            onPress: () => navigation.goBack()
          }
        ]);
      } else {
        Alert.alert(
          "Update Failed", 
          data.message || data.error || "Failed to update profile. Please try again."
        );
      }
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert(
        "Network Error", 
        error.message || "Failed to connect to server. Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (!loading) {
      navigation.goBack();
    }
  };

  if (initialLoad) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity 
          onPress={handleCancel}
          style={styles.backButton}
          disabled={loading}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.headerRightPlaceholder} />
      </View> */}

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={[styles.input, loading && styles.inputDisabled]}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor="#999"
              editable={!loading}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address *</Text>
            <TextInput
              style={[styles.input, loading && styles.inputDisabled]}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email address"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.cancelButton, loading && styles.buttonDisabled]} 
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.saveButton, loading && styles.buttonDisabled]} 
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* {userId ? (
            <View style={styles.userIdContainer}>
              <Text style={styles.userIdLabel}>User ID:</Text>
              <Text style={styles.userIdText}>{userId}</Text>
            </View>
          ) : null} */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8f9fa" 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa"
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6c757d"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  backButton: {
    padding: 4
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212529",
    textAlign: "center"
  },
  headerRightPlaceholder: {
    width: 32
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1
  },
  form: {
    padding: 20,
    flex: 1
  },
  inputContainer: {
    marginBottom: 20
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#495057",
    fontWeight: "600"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#212529"
  },
  inputDisabled: {
    backgroundColor: "#e9ecef",
    color: "#6c757d"
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 20
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#e9ecef",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#dee2e6"
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#6366f1",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 10
  },
  buttonDisabled: {
    opacity: 0.6
  },
  cancelButtonText: {
    color: "#495057",
    fontWeight: "600",
    fontSize: 16
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16
  },
  userIdContainer: {
    backgroundColor: "#e9ecef",
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center"
  },
  userIdLabel: {
    fontSize: 12,
    color: "#6c757d",
    fontWeight: "500",
    marginBottom: 4
  },
  userIdText: {
    fontSize: 14,
    color: "#495057",
    fontWeight: "600",
    fontFamily: 'monospace'
  }
});

export default EditProfileScreen;