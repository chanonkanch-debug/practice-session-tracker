import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SheetAnalysisApi } from '../../services/SheetAnalysisApi';
import React from 'react';

export default function AnalyzeSheetScreen({ navigation }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Reset when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        // Reset on screen blur (when leaving)
        setSelectedImage(null);
      };
    }, [])
  );

  // Request permissions
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is needed to take photos');
      return false;
    }
    return true;
  };

  // Take photo
  const handleTakePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      console.log('Camera error:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  // Pick from gallery
  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      console.log('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // Analyze sheet music
  const handleAnalyze = async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select or take a photo first');
      return;
    }

    try {
      setIsAnalyzing(true);

      // Send base64 image to backend
      const response = await SheetAnalysisApi.analyzeSheet(selectedImage.base64);

      // Navigate to results screen
      navigation.navigate('AnalysisResult', {
        analysis: response.analysis
      });

    } catch (error) {
      console.log('Analysis error:', error);
      Alert.alert('Error', error.message || 'Failed to analyze sheet music');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Clear image
  const handleClear = () => {
    setSelectedImage(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}>📸</Text>
        <Text style={styles.title}>Analyze Sheet Music</Text>
        <Text style={styles.subtitle}>
          Take a photo or upload sheet music to get practice recommendations
        </Text>
      </View>

      {/* Image Preview */}
      {selectedImage ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedImage.uri }} style={styles.image} />
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderIcon}>🎼</Text>
          <Text style={styles.placeholderText}>No image selected</Text>
        </View>
      )}

      {/* Action Buttons */}
      {!selectedImage && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleTakePhoto}
          >
            <Text style={styles.actionIcon}>📷</Text>
            <Text style={styles.actionText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handlePickImage}
          >
            <Text style={styles.actionIcon}>🖼️</Text>
            <Text style={styles.actionText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Analyze Button */}
      {selectedImage && (
        <TouchableOpacity
          style={styles.analyzeButton}
          onPress={handleAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <View style={styles.analyzingContainer}>
              <ActivityIndicator color="white" size="small" />
              <Text style={styles.analyzeButtonText}>Analyzing...</Text>
            </View>
          ) : (
            <Text style={styles.analyzeButtonText}>🔍 Analyze Sheet Music</Text>
          )}
        </TouchableOpacity>
      )}

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoIcon}>💡</Text>
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>Tips for Best Results</Text>
          <Text style={styles.infoText}>
            • Ensure good lighting{'\n'}
            • Keep sheet music flat{'\n'}
            • Capture the entire page{'\n'}
            • Avoid shadows and glare
          </Text>
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  headerIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  clearButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholderContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 60,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  placeholderIcon: {
    fontSize: 80,
    marginBottom: 16,
    opacity: 0.3,
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  actionButtons: {
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 32,
  },
  actionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  analyzeButton: {
    backgroundColor: '#6200ee',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#6200ee',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  analyzingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  analyzeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 12,
  },
  infoIcon: {
    fontSize: 24,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1976d2',
    lineHeight: 22,
  },
});