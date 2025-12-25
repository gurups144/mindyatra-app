import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { COLORS, SIZES } from '../utils/constants';

const TermsConditionsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={styles.headerRight} />
      </View>
      <WebView
        source={{ uri: 'https://mindyatra.in/Homepage/terms_condition' }}
        style={styles.webview}
        startInLoadingState={true}
        scalesPageToFit={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    width: '100%',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SIZES.padding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: StatusBar.currentHeight + 10,
    paddingBottom: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.white,
    flex: 1,
    textAlign: 'center',
    marginRight: 30, // To compensate for the back button width
  },
  headerRight: {
    width: 30, // Same as back button for balance
  },
  webview: {
    flex: 1,
    width: '100%',
    margin: 0,
    padding: 0,
  },
});

export default TermsConditionsScreen;