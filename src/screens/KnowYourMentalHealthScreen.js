import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Platform,
  StyleSheet,
  View
} from "react-native";
import { WebView } from "react-native-webview";
import { COLORS } from "../utils/constants";

const KnowYourMentalHealthScreen = ({ route, navigation }) => {
  const { url } = route.params;
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef(null);
  const redirectTriggered = useRef(false);
  const [recording, setRecording] = useState(null);
  const [lastMessageId, setLastMessageId] = useState(0);

  // Request microphone permission
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Audio.requestPermissionsAsync();
      console.log('Audio permission status:', status);
    };
    requestPermissions();
    
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, []);

  // Send message to WebView using injectJavaScript
  const sendMessageToWebView = (data) => {
    console.log('Sending to WebView:', data.type);
    
    if (!webViewRef.current) {
      console.error('WebView ref not available');
      return;
    }
    
    const messageId = lastMessageId + 1;
    setLastMessageId(messageId);
    
    // Escape the data for JavaScript injection
    const escapedData = JSON.stringify(data).replace(/'/g, "\\'");
    
    // Inject JavaScript directly - this is MORE RELIABLE than postMessage
    const jsCode = `
      try {
        if (window.handleReactNativeMessage) {
          window.handleReactNativeMessage(${escapedData});
        } else {
          console.warn('handleReactNativeMessage not defined yet');
          // Store for later
          window.pendingNativeMessage = ${escapedData};
        }
      } catch(e) {
        console.error('Error in injected JS:', e);
      }
    `;
    
    webViewRef.current.injectJavaScript(jsCode);
  };

  // Start native audio recording in MP3 format
  const startNativeRecording = async () => {
    try {
      console.log('Starting MP3 recording...');
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      // Configure for MP3/AAC format
      const recordingOptions = {
        android: {
          extension: '.mp3',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
      };

      const { recording } = await Audio.Recording.createAsync(recordingOptions);
      setRecording(recording);
      console.log('Recording started');
      
      sendMessageToWebView({
        type: "RECORDING_STARTED",
        message: "Recording started... Speak now"
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
  const stopNativeRecording = async () => {
    try {
      console.log('Stopping recording...');
      
      if (!recording) {
        sendMessageToWebView({
          type: "RECORDING_ERROR",
          message: "No recording in progress"
        });
        return null;
      }

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Recording stopped. URI:', uri);
      
      if (uri) {
        // Convert to base64
        const base64 = await convertAudioToBase64(uri);
        console.log('Audio converted to base64, length:', base64?.length || 0);
        
        // Determine mime type based on platform
        const mimeType = Platform.OS === 'ios' ? 'audio/m4a' : 'audio/mp3';
        
        sendMessageToWebView({
          type: "RECORDING_COMPLETE",
          path: uri,
          base64: base64,
          mimeType: mimeType,
          message: "Recording complete! Click play to listen"
        });
        
        setRecording(null);
        return uri;
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

  // Convert audio file to base64
  const convertAudioToBase64 = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = reader.result.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Base64 conversion failed:', error);
      throw error;
    }
  };

  const handleMessage = async (event) => {
    try {
        const data = JSON.parse(event.nativeEvent.data);
        console.log('📱 Message type from WebView:', data.type);
        
        switch (data.type) {
            case "START_RECORDING":
                await startNativeRecording();
                break;
                
            case "STOP_RECORDING":
                await stopNativeRecording();
                break;
                
            case "UPLOAD_AUDIO":
                await handleAudioUpload(data.base64, data.mimeType, data.lastId);
                break;
                
            // 🔥 THIS IS THE IMPORTANT PART 🔥
            case "ASSESSMENT_COMPLETE":
                console.log('🎉 Assessment complete received!');
                redirectToHome();  // Call the redirect function
                break;
                
            case "DEBUG_LOG":
                console.log('WebView Log:', data.message);
                break;
                
            default:
                console.log('Unknown message type:', data.type);
        }
    } catch (error) {
        console.error('Error processing message:', error);
    }
};
  

  // SIMPLIFIED upload - just use original base64 without WebM conversion
  const handleAudioUpload = async (base64Data, mimeType, lastId) => {
    try {
      console.log('📤 Uploading audio (original format)...');
      
      // Use the original format - backend needs to accept it
      const formData = new FormData();
      const extension = mimeType === 'audio/m4a' ? 'm4a' : 'mp3';
      const filename = `recording_${Date.now()}.${extension}`;
      
      // Create a simple FormData
      const file = {
        uri: `data:${mimeType};base64,${base64Data}`,
        type: mimeType,
        name: filename,
      };
      
      formData.append('audio_data', file);
      formData.append('last_id', lastId || 0);
      
      const backendUrl = 'https://mindyatra.in/Api/upload_audio';
      console.log('📤 Uploading to:', backendUrl, 'as', extension);
      
      const response = await fetch(backendUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const resultText = await response.text();
      console.log('📤 Upload raw response:', resultText);
      
      let result;
      try {
        result = JSON.parse(resultText);
      } catch (e) {
        console.error('Failed to parse JSON:', e);
        result = { status: 'error', msg: 'Invalid server response: ' + resultText.substring(0, 100) };
      }
      
      console.log('📤 Upload result:', result);
      
      sendMessageToWebView({
        type: "UPLOAD_COMPLETE",
        data: result,
        message: result.status === 'success' ? 'Upload successful!' : 'Upload failed'
      });
      
    } catch (error) {
      console.error('❌ Upload error:', error);
      sendMessageToWebView({
        type: "UPLOAD_ERROR",
        message: 'Upload failed: ' + error.message
      });
    }
  };

// Add this function if you don't have it
const redirectToHome = () => {
    console.log('🚀 Redirecting to homepage...');
    
    if (redirectTriggered.current) return;
    redirectTriggered.current = true;
    
    // Store status and navigate
    AsyncStorage.setItem('paid_status', '0')
      .then(() => {
        console.log("✅ Paid status updated, navigating home...");
        navigation.replace('MainTabs'); // Or whatever your home screen is called
      })
      .catch(error => {
        console.error('❌ Error saving status:', error);
        navigation.replace('MainTabs'); // Still navigate even if AsyncStorage fails
      });
};

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

  // SIMPLIFIED JavaScript injection
  const injectedJavaScript = `
    (function() {
      console.log('=== WebView Audio Bridge v2 ===');
      
      // Global state
      window.nativeAudioData = null;
      window.isReactNative = !!window.ReactNativeWebView;
      
      // Handle messages from React Native
      window.handleReactNativeMessage = function(data) {
        console.log('🎯 React Native message received:', data.type);
        
        switch(data.type) {
          case 'RECORDING_STARTED':
            console.log('🎤 Recording started');
            document.getElementById('recordBtn').textContent = "Recording...";
            break;
            
          case 'RECORDING_COMPLETE':
            console.log('✅ Recording complete!');
            window.nativeAudioData = data;
            
            // Update UI
            document.getElementById('recordBtn').textContent = "Start Recording";
            
            // Update audio player
            const audioPlayback = document.getElementById('audioPlayback');
            if (audioPlayback && data.base64) {
              console.log('Setting audio source, base64 length:', data.base64.length);
              
              // Create data URL
              const audioUrl = 'data:' + data.mimeType + ';base64,' + data.base64;
              
              // Clear and set source
              audioPlayback.src = '';
              audioPlayback.src = audioUrl;
              audioPlayback.style.display = 'block';
              
              // Load the audio
              audioPlayback.load();
              
              // Show a message
              if (data.message) {
                alert(data.message);
              }
              
              // Try to play (user may need to click)
              setTimeout(() => {
                audioPlayback.play().catch(e => {
                  console.log('Auto-play blocked (normal):', e.message);
                });
              }, 500);
            }
            break;
            
          case 'UPLOAD_COMPLETE':
            console.log('📤 Upload complete:', data.data);
            
            // Reset button
            const uploadBtn = document.querySelector('button[onclick="uploadAndNext()"]');
            if (uploadBtn) {
              uploadBtn.textContent = "Next ➡️";
              uploadBtn.disabled = false;
            }
            
            if (data.data.status === 'success') {
              // Move to next step
              if (typeof showTransition === 'function') {
                showTransition(() => {
                  document.getElementById('step2').style.display = 'none';
                  document.getElementById('step5').style.display = 'block';
                });
              }
            } else {
              alert('Upload failed: ' + (data.data.msg || 'Unknown error'));
            }
            break;
            
          case 'UPLOAD_ERROR':
          case 'RECORDING_ERROR':
            console.error('❌ Error:', data.message);
            alert(data.message || 'An error occurred');
            
            // Reset buttons
            document.getElementById('recordBtn').textContent = "Start Recording";
            const uploadBtn2 = document.querySelector('button[onclick="uploadAndNext()"]');
            if (uploadBtn2) {
              uploadBtn2.textContent = "Next ➡️";
              uploadBtn2.disabled = false;
            }
            break;
        }
      };
      
      // Check for pending messages
      if (window.pendingNativeMessage) {
        console.log('Processing pending message');
        window.handleReactNativeMessage(window.pendingNativeMessage);
        window.pendingNativeMessage = null;
      }
      
      // Override recording functions if in React Native
      if (window.isReactNative) {
        console.log('🔧 Overriding functions for React Native');
        
        // Override startRecording
        const originalStart = window.startRecording;
        window.startRecording = function() {
          console.log('Start Recording (React Native)');
          document.getElementById('recordBtn').textContent = "Recording...";
          
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: "START_RECORDING"
          }));
        };
        
        // Override stopRecording
        const originalStop = window.stopRecording;
        window.stopRecording = function() {
          console.log('Stop Recording (React Native)');
          
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: "STOP_RECORDING"
          }));
        };
        
        // Override uploadAndNext
        const originalUpload = window.uploadAndNext;
        window.uploadAndNext = function() {
          console.log('Upload and Next (React Native)');
          
          if (!window.nativeAudioData || !window.nativeAudioData.base64) {
            alert("Please record some audio first.");
            return;
          }
          
          const lastId = document.getElementById('last_notes_id')?.value || 0;
          const uploadBtn = document.querySelector('button[onclick="uploadAndNext()"]');
          
          if (uploadBtn) {
            uploadBtn.textContent = "Uploading...";
            uploadBtn.disabled = true;
          }
          
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: "UPLOAD_AUDIO",
            base64: window.nativeAudioData.base64,
            mimeType: window.nativeAudioData.mimeType,
            lastId: lastId
          }));
        };
      }
      
      console.log('✅ WebView bridge ready');
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

      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        onLoadEnd={() => {
          console.log('✅ WebView loaded');
          setLoading(false);
          
          // Send a test message to verify communication
          setTimeout(() => {
            sendMessageToWebView({
              type: "TEST",
              message: "WebView communication test"
            });
          }, 1000);
        }}
        onMessage={handleMessage}
        injectedJavaScript={injectedJavaScript}
        onError={(error) => {
          console.error('❌ WebView error:', error.nativeEvent);
        }}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}
        // Enable debugging
        onContentProcessDidTerminate={() => {
          console.log('WebView terminated, reloading...');
          webViewRef.current?.reload();
        }}
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