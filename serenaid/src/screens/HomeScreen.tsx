import React, { useState } from 'react';
import { Alert, View, StyleSheet, Text, TextInput, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import BackgroundAnimation from '../components/BackgroundAnimation';
import SwayLogo from '../components/SwayLogo';
import AppName from '../components/AppName';

const HomeScreen = () => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = async () => {
    const url = 'http://34.30.141.54:80/api/music';
    const body = JSON.stringify({
      description: prompt,
      duration: 3, // Default length
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();

      // Use FileReader to read the Blob as a base64 string
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64Data = reader.result.split(',')[1]; // Get the base64 data
        const path = `${RNFS.DownloadDirectoryPath}/test.wav`;

        try {
          await RNFS.writeFile(path, base64Data, 'base64');
          Alert.alert('Audio file saved successfully');
        } catch (writeError) {
          console.error('Error writing audio file:', writeError.message);
          Alert.alert(`Error saving audio file: ${writeError.message}`);
        }
      };

      // Read the Blob as a Data URL to extract base64 data
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error fetching or saving audio:', error.message);
      Alert.alert(`Error fetching or saving audio: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <BackgroundAnimation />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.upperContent}>
          <SwayLogo />
          <AppName />
        </View>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
          <View style={styles.lowerContent}>
            <TextInput
              style={styles.textInput}
              onChangeText={setPrompt}
              value={prompt}
              placeholder="Sleep easily..."
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Generate</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  upperContent: {
    position: 'absolute',
    top: '20%', // Adjusted top margin to bring content closer to the top but not touching the app bar
    alignItems: 'center',
    width: '100%',
  },
  keyboardAvoidView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lowerContent: {
    marginTop: 160, // Ensures that the lower content is well below the upper content
    width: '80%',
    alignItems: 'center',
  },
  textInput: {
    height: 40,
    width: '100%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#FFF',
  },
  button: {
    backgroundColor: '#5D5FEF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
