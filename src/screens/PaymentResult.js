import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PaymentResult({ route, navigation }) {
  const { success } = route.params;

  useEffect(() => {
    if (success) {
      // Update paid_status in AsyncStorage
      AsyncStorage.setItem("paid_status", "1");
    }
  }, [success]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {success ? "Payment Successful ✅" : "Payment Failed ❌"}
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace("Subscription")}
      >
        <Text style={styles.buttonText}>Back to Subscription</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  button: {
    backgroundColor: "#E91E63",
    padding: 15,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
