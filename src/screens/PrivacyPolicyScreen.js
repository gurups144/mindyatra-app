import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { COLORS, SIZES } from '../utils/constants';

const PrivacyPolicyScreen = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.headerRight} />
      </View>
      <WebView
        source={{ 
          uri: 'https://mindyatra.in/Homepage/privacy_policy',
          headers: {
            'Content-Type': 'text/html; charset=UTF-8',
          },
        }}
        style={styles.webview}
        startInLoadingState={true}
        scalesPageToFit={Platform.OS === 'android'}
        bounces={false}
        scrollEnabled={true}
        automaticallyAdjustContentInsets={false}
        contentInset={{ top: 0, right: 0, bottom: 0, left: 0 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        injectedJavaScript={`
          const meta = document.createElement('meta'); 
          meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'); 
          meta.setAttribute('name', 'viewport'); 
          document.getElementsByTagName('head')[0].appendChild(meta);
          true;
        `}
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
    alignSelf: 'stretch',
    overflow: 'hidden',
    flexGrow: 1,
  },
});

export default PrivacyPolicyScreen;