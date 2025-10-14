import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import ChartComponent from '../components/ChartComponent';
import { COLORS, SIZES } from '../utils/constants';
import { apiService } from '../services/api';

const AIAnalysisScreen = ({ navigation }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (text.trim().length < 10) {
      Alert.alert('Input Required', 'Please enter at least 10 characters to analyze');
      return;
    }

    setLoading(true);
    const response = await apiService.analyzeText(text);
    setLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      Alert.alert('Error', response.error || 'Failed to analyze text');
    }
  };

  const handleReset = () => {
    setText('');
    setResult(null);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color={COLORS.white} onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>AI Text Analysis</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Input Section */}
        {!result && (
          <>
            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={24} color={COLORS.info} />
              <Text style={styles.infoText}>
                Share your thoughts, feelings, or any text. Our AI will analyze the sentiment and emotions.
              </Text>
            </View>

            <View style={styles.inputCard}>
              <Text style={styles.label}>Your Thoughts</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Write about how you're feeling today..."
                value={text}
                onChangeText={setText}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>{text.length} characters</Text>
            </View>

            <Button 
              title="Analyze Text" 
              onPress={handleAnalyze}
              loading={loading}
              disabled={text.length < 10}
            />
          </>
        )}

        {/* Results Section */}
        {result && (
          <>
            {/* Sentiment Card */}
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Ionicons name="happy" size={32} color={COLORS.primary} />
                <Text style={styles.resultTitle}>Sentiment Analysis</Text>
              </View>
              <View style={styles.sentimentBox}>
                <Text style={styles.sentimentLabel}>{result.sentiment.label}</Text>
                <Text style={styles.sentimentScore}>
                  {Math.round(result.sentiment.score)}%
                </Text>
              </View>
            </View>

            {/* Emotions Chart */}
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Ionicons name="bar-chart" size={32} color={COLORS.secondary} />
                <Text style={styles.resultTitle}>Emotion Breakdown</Text>
              </View>
              <ChartComponent data={result.emotions} type="bar" />
            </View>

            {/* Advice Section */}
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Ionicons name="bulb" size={32} color={COLORS.warning} />
                <Text style={styles.resultTitle}>Personalized Advice</Text>
              </View>
              {result.advice.map((advice, index) => (
                <View key={index} style={styles.adviceItem}>
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                  <Text style={styles.adviceText}>{advice}</Text>
                </View>
              ))}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <Button 
                title="Analyze Again" 
                onPress={handleReset}
                variant="outline"
                style={styles.actionButton}
              />
              <Button 
                title="Book Session" 
                onPress={() => navigation.navigate('Booking')}
                style={styles.actionButton}
              />
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: SIZES.padding,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: SIZES.h3,
    fontWeight: 'bold',
  },
  content: {
    padding: SIZES.padding,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.info + '20',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
  },
  infoText: {
    flex: 1,
    marginLeft: SIZES.base,
    fontSize: SIZES.font,
    color: COLORS.dark,
    lineHeight: 20,
  },
  inputCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    elevation: 2,
  },
  label: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SIZES.base,
  },
  textArea: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius / 2,
    padding: SIZES.padding,
    fontSize: SIZES.medium,
    color: COLORS.dark,
    minHeight: 150,
    marginBottom: SIZES.base,
  },
  charCount: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    textAlign: 'right',
  },
  resultCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  resultTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginLeft: SIZES.base,
  },
  sentimentBox: {
    alignItems: 'center',
    padding: SIZES.padding,
  },
  sentimentLabel: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SIZES.base,
  },
  sentimentScore: {
    fontSize: SIZES.h1,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  adviceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.padding,
  },
  adviceText: {
    flex: 1,
    fontSize: SIZES.medium,
    color: COLORS.dark,
    marginLeft: SIZES.base,
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SIZES.padding,
    marginTop: SIZES.padding,
  },
  actionButton: {
    flex: 1,
  },
});

export default AIAnalysisScreen;
