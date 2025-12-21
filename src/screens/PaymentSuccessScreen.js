import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { BackHandler, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PaymentSuccessScreen = ({ navigation }) => {
  
  useEffect(() => {
    // Update local paid status
    const updatePaidStatus = async () => {
      await AsyncStorage.setItem('paid_status', '1');
      console.log("Paid status updated to 1");
    };
    
    updatePaidStatus();
    
    // Prevent going back
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.replace('MainTabs');
        return true;
      }
    );
    
    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Ionicons name="checkmark-circle" size={100} color="#22c55e" />
      <Text style={styles.title}>Payment Successful! 🎉</Text>
      <Text style={styles.subtitle}>
        Your MindYatra Premium subscription is now active.
      </Text>
      <Text style={styles.message}>
        You can now access all premium features.
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
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#16a34a',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 10,
    marginHorizontal: 20,
  },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});