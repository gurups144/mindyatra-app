import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View
} from "react-native";
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import { WebView } from "react-native-webview";
import { COLORS } from "../utils/constants";

const KnowYourMentalHealthScreen = ({ route, navigation }) => {
  const { url } = route.params;
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef(null);
  const redirectTriggered = useRef(false);
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer());
  const isRecording = useRef(false);
  const recordingPath = useRef('');

  // Request microphone permission for Android
  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        await requestMicrophonePermission();
      }
    };
    requestPermissions();
    
    // Initialize audio recorder
    audioRecorderPlayer.current.setSubscriptionDuration(0.1);
    
    return () => {
      // Cleanup on unmount
      if (isRecording.current) {
        stopNativeRecording();
      }
    };
  }, []);

  const requestMicrophonePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: "Microphone Permission",
          message: "This app needs access to your microphone to record audio.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // Start native audio recording
  const startNativeRecording = async () => {
    try {
      if (Platform.OS === 'android') {
        const hasPermission = await requestMicrophonePermission();
        if (!hasPermission) {
          sendMessageToWebView({
            type: "RECORDING_ERROR",
            message: "Microphone permission denied"
          });
          return;
        }
      }

      const path = Platform.select({
        ios: 'recording.m4a',
        android: `${RNFS.ExternalDirectoryPath}/recording.mp3`,
      });

      const audioSet = {
        AudioEncoderAndroid: 3, // AAC
        AudioSourceAndroid: 1, // MIC
        AVEncoderAudioQualityKeyIOS: 96, // High quality
        AVNumberOfChannelsKeyIOS: 2,
        AVFormatIDKeyIOS: 1819304813, // kAudioFormatMPEG4AAC
      };

      recordingPath.current = await audioRecorderPlayer.current.startRecorder(path, audioSet);
      isRecording.current = true;
      console.log('Recording started at:', recordingPath.current);
      
      sendMessageToWebView({
        type: "RECORDING_STARTED"
      });
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      sendMessageToWebView({
        type: "RECORDING_ERROR",
        message: error.message
      });
    }
  };

  // Stop native audio recording
// Stop native audio recording - ensure this is in your component
const stopNativeRecording = async () => {
    try {
        console.log('Attempting to stop recording, isRecording:', isRecording.current);
        
        if (!isRecording.current) {
            console.log('No recording in progress');
            sendMessageToWebView({
                type: "RECORDING_ERROR",
                message: "No recording in progress"
            });
            return null;
        }
        
        const result = await audioRecorderPlayer.current.stopRecorder();
        console.log('Recording stopped, result:', result);
        
        audioRecorderPlayer.current.removeRecordBackListener();
        isRecording.current = false;
        
        // Read file as base64
        if (result) {
            console.log('Reading file as base64...');
            const fileData = await RNFS.readFile(result, 'base64');
            
            sendMessageToWebView({
                type: "RECORDING_COMPLETE",
                path: result,
                base64: fileData,
                mimeType: Platform.OS === 'ios' ? 'audio/m4a' : 'audio/mp3'
            });
            
            return result;
        } else {
            console.error('No result from stopRecorder');
            sendMessageToWebView({
                type: "RECORDING_ERROR",
                message: "Recording stopped but no file was created"
            });
            return null;
        }
        
    } catch (error) {
        console.error('Failed to stop recording:', error);
        sendMessageToWebView({
            type: "RECORDING_ERROR",
            message: error.message
        });
        return null;
    }
};

  // Send message to WebView
  const sendMessageToWebView = (data) => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify(data));
    }
  };

  // Handle messages from WebView
// In your handleMessage function in React Native:
const handleMessage = async (event) => {
    try {
        console.log('RAW message from WebView:', event.nativeEvent.data);
        
        const data = JSON.parse(event.nativeEvent.data);
        console.log('Parsed message from WebView:', data);
        
        switch (data.type) {
            case "START_RECORDING":
                console.log('Starting native recording...');
                await startNativeRecording();
                break;
                
            case "STOP_RECORDING":
                console.log('Stopping native recording...');
                await stopNativeRecording();
                break;
                
            case "UPLOAD_AUDIO":
                console.log('Uploading audio...');
                await handleAudioUpload(data.base64, data.mimeType, data.lastId);
                break;
                
            case "ASSESSMENT_COMPLETE":
                console.log('Assessment complete, redirecting...');
                redirectToHome();
                break;
                
            default:
                console.log('Unknown message type:', data.type);
        }
    } catch (error) {
        console.error('Error processing message:', error);
        console.log('Failed to parse message:', event.nativeEvent.data);
    }
};

  // Handle audio upload to server
  const handleAudioUpload = async (base64Data, mimeType, lastId) => {
    try {
      // Create form data
      const formData = new FormData();
      const filename = `recording_${Date.now()}.${mimeType.split('/')[1]}`;
      
      formData.append('audio_data', {
        uri: `data:${mimeType};base64,${base64Data}`,
        type: mimeType,
        name: filename,
      });
      formData.append('last_id', lastId || 0);
      
      const response = await fetch('YOUR_BACKEND_URL/Api/upload_audio', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const result = await response.json();
      console.log('Upload response:', result);
      
      sendMessageToWebView({
        type: "UPLOAD_COMPLETE",
        data: result
      });
      
    } catch (error) {
      console.error('Upload error:', error);
      sendMessageToWebView({
        type: "UPLOAD_ERROR",
        message: error.message
      });
    }
  };

  const redirectToHome = () => {
    if (redirectTriggered.current) return;
    redirectTriggered.current = true;
    
    AsyncStorage.setItem('paid_status', '0')
      .then(() => {
        console.log("Assessment complete, redirecting to home...");
        navigation.replace('MainTabs');
      });
  };

  // Handle Android back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        Alert.alert(
          'Exit Assessment?',
          'Are you sure you want to leave? Your progress may not be saved.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Exit', 
              onPress: () => {
                AsyncStorage.setItem('paid_status', '0');
                navigation.goBack();
              }
            }
          ]
        );
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  // JavaScript to inject for audio recording support
  // Replace the entire injectedJavaScript variable with this:
const injectedJavaScript = `
    (function() {
        // Store audio data
        window.nativeAudioData = null;
        
        // Audio context fix for iOS
        document.addEventListener('touchstart', function() {
            if (window.AudioContext || window.webkitAudioContext) {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                if (audioContext.state === 'suspended') {
                    audioContext.resume();
                }
            }
        }, { once: true });
        
        console.log('WebView audio bridge injected successfully');
        
        // Add event listener for messages from React Native
        document.addEventListener('message', function(event) {
            try {
                const data = JSON.parse(event.data);
                console.log('Message from React Native:', data);
                window.dispatchEvent(new MessageEvent('message', { data: event.data }));
            } catch (e) {
                console.error('Error processing message:', e);
            }
        });
        
        // Initialize ReactNativeWebView communication
        if (window.ReactNativeWebView) {
            console.log('ReactNativeWebView detected - using native audio recording');
        }
    })();
    true;
`;
  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
// In your return statement, update the WebView component:
<WebView
    ref={webViewRef}
    source={{ uri: url }}
    javaScriptEnabled={true}
    domStorageEnabled={true}
    mediaPlaybackRequiresUserAction={false}
    allowsInlineMediaPlayback={true}
    onLoadEnd={() => {
        setLoading(false);
        console.log('WebView loaded successfully');
    }}
    onMessage={handleMessage}
    injectedJavaScript={injectedJavaScript}
    onError={(error) => {
        console.error("WebView Error:", error);
        Alert.alert('Error', 'Failed to load page. Please check your internet connection.');
    }}
    onHttpError={(error) => {
        console.error("HTTP Error:", error);
    }}
    onContentProcessDidTerminate={() => {
        console.warn('Content process terminated, reloading...');
        webViewRef.current?.reload();
    }}
    startInLoadingState={true}
    renderLoading={() => (
        <View style={styles.loader}>
            <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
    )}
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
    backgroundColor: "#fff",
  },
});

export default KnowYourMentalHealthScreen;