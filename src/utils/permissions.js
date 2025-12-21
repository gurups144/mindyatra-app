import * as Permissions from 'expo-permissions';
import { Alert, Linking, Platform } from 'react-native';

export const requestAudioPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Microphone access is needed for audio recording in the assessment.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Open Settings', 
              onPress: () => Linking.openSettings() 
            }
          ]
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('Permission error:', error);
      return false;
    }
  }
  return true; // iOS handles this differently
};