import { useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import { COLORS } from "../utils/constants";

const KnowYourMentalHealthScreen = ({ route, navigation }) => {
  const { url } = route.params;
  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}

      <WebView
        source={{ uri: url }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        
        // 🔥 AUDIO PLAYBACK
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        
        // 🔥 AUDIO/MIC PERMISSIONS
        onPermissionRequest={(request) => {
          const { resources } = request;
          if (resources.includes('microphone') || resources.includes('camera')) {
            request.grant(resources);
          } else {
            request.grant();
          }
        }}
        
        // 🔥 ADDITIONAL PROPERTIES FOR AUDIO
        allowsProtectedMedia={true}
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}
        
        // 🔥 ANDROID SPECIFIC
        {...(Platform.OS === 'android' && { 
          allowsAudioRecording: true,
          mixedContentMode: "always"
        })}
        
        // 🔥 iOS SPECIFIC
        {...(Platform.OS === 'ios' && {
          allowsBackForwardNavigationGestures: true
        })}
        
        // 🔥 COOKIES & STORAGE
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
        cacheEnabled={true}
        
        onLoadEnd={() => setLoading(false)}
        
        // 🔥 INJECT JAVASCRIPT TO ENSURE AUDIO CONTEXT
        injectedJavaScript={`
          (function() {
            // Resume AudioContext on user interaction
            document.addEventListener('touchstart', function() {
              if (window.AudioContext || window.webkitAudioContext) {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                if (audioContext.state === 'suspended') {
                  audioContext.resume();
                }
              }
            }, { once: true });
          })();
          true;
        `}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
});

export default KnowYourMentalHealthScreen;