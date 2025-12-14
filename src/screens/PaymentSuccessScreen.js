import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PaymentSuccessScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="checkmark-circle" size={90} color="#22c55e" />
      <Text style={styles.title}>Payment Successful 🎉</Text>
      <Text style={styles.subtitle}>
        Your MindYatra Premium is now active.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace('MainTabs')}
      >
        <Text style={styles.buttonText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#16a34a',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
