import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import { COLORS, SIZES } from '../utils/constants';
import { apiService } from '../services/api';

const QUESTIONS = [
  { id: 1, text: 'Little interest or pleasure in doing things' },
  { id: 2, text: 'Feeling down, depressed, or hopeless' },
  { id: 3, text: 'Trouble falling or staying asleep, or sleeping too much' },
  { id: 4, text: 'Feeling tired or having little energy' },
  { id: 5, text: 'Poor appetite or overeating' },
  { id: 6, text: 'Feeling bad about yourself or that you are a failure' },
  { id: 7, text: 'Trouble concentrating on things' },
  { id: 8, text: 'Moving or speaking so slowly that others noticed' },
  { id: 9, text: 'Thoughts that you would be better off dead' },
];

const OPTIONS = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' },
];

const DepressionMeterScreen = ({ navigation }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [currentQuestion]: value };
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitTest(newAnswers);
    }
  };

  const submitTest = async (finalAnswers) => {
    setLoading(true);
    const response = await apiService.submitDepressionTest(finalAnswers);
    setLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      Alert.alert('Error', response.error || 'Failed to process test');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons name="hourglass" size={80} color={COLORS.primary} />
        <Text style={styles.loadingText}>Processing your responses...</Text>
      </View>
    );
  }

  if (result) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Your Results</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.content}>
          {/* Score Display */}
          <View style={[styles.scoreCard, { borderLeftColor: result.color }]}>
            <View style={styles.scoreHeader}>
              <Ionicons name="pulse" size={48} color={result.color} />
              <View style={styles.scoreInfo}>
                <Text style={styles.severityLabel}>{result.severity}</Text>
                <Text style={styles.scoreText}>Score: {result.score}/{QUESTIONS.length * 3}</Text>
              </View>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${result.percentage}%`, backgroundColor: result.color }
                ]} 
              />
            </View>
          </View>

          {/* Recommendations */}
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Ionicons name="clipboard" size={28} color={COLORS.primary} />
              <Text style={styles.resultTitle}>Recommendations</Text>
            </View>
            {result.recommendations.map((rec, index) => (
              <View key={index} style={styles.recommendationItem}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                <Text style={styles.recommendationText}>{rec}</Text>
              </View>
            ))}
          </View>

          {/* Important Note */}
          <View style={styles.noteCard}>
            <Ionicons name="alert-circle" size={24} color={COLORS.warning} />
            <Text style={styles.noteText}>
              This is a screening tool, not a diagnosis. Please consult a mental health professional for proper evaluation.
            </Text>
          </View>

          {/* Action Buttons */}
          <Button 
            title="Book Session with Professional" 
            onPress={() => navigation.navigate('Booking')}
            style={styles.actionButton}
          />
          <Button 
            title="Take Test Again" 
            onPress={handleReset}
            variant="outline"
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
    );
  }

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons 
          name="arrow-back" 
          size={24} 
          color={COLORS.white} 
          onPress={() => currentQuestion === 0 ? navigation.goBack() : handlePrevious()} 
        />
        <Text style={styles.headerTitle}>Depression Assessment</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Question {currentQuestion + 1} of {QUESTIONS.length}
        </Text>
      </View>

      {/* Question */}
      <ScrollView style={styles.content}>
        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <Ionicons name="help-circle" size={32} color={COLORS.primary} />
            <Text style={styles.questionNumber}>Question {currentQuestion + 1}</Text>
          </View>
          <Text style={styles.questionText}>{QUESTIONS[currentQuestion].text}</Text>
          <Text style={styles.questionSubtext}>
            Over the last 2 weeks, how often have you been bothered by this?
          </Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                answers[currentQuestion] === option.value && styles.optionSelected,
              ]}
              onPress={() => handleAnswer(option.value)}
            >
              <View style={styles.optionContent}>
                <Text style={[
                  styles.optionLabel,
                  answers[currentQuestion] === option.value && styles.optionLabelSelected,
                ]}>
                  {option.label}
                </Text>
                {answers[currentQuestion] === option.value && (
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
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
  progressContainer: {
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SIZES.base,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
  },
  questionCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding * 1.5,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding * 2,
    elevation: 2,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  questionNumber: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginLeft: SIZES.base,
  },
  questionText: {
    fontSize: SIZES.large,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SIZES.padding,
    lineHeight: 28,
  },
  questionSubtext: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    fontStyle: 'italic',
  },
  optionsContainer: {
    gap: SIZES.padding,
  },
  optionButton: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding * 1.5,
    borderRadius: SIZES.radius,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    elevation: 1,
  },
  optionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: SIZES.medium,
    color: COLORS.dark,
    fontWeight: '500',
  },
  optionLabelSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  loadingText: {
    fontSize: SIZES.large,
    color: COLORS.gray,
    marginTop: SIZES.padding,
  },
  scoreCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding * 1.5,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    borderLeftWidth: 6,
    elevation: 2,
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  scoreInfo: {
    marginLeft: SIZES.padding,
    flex: 1,
  },
  severityLabel: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  scoreText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    marginTop: 4,
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
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.padding,
  },
  recommendationText: {
    flex: 1,
    fontSize: SIZES.medium,
    color: COLORS.dark,
    marginLeft: SIZES.base,
    lineHeight: 22,
  },
  noteCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.warning + '20',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
  },
  noteText: {
    flex: 1,
    marginLeft: SIZES.base,
    fontSize: SIZES.font,
    color: COLORS.dark,
    lineHeight: 20,
  },
  actionButton: {
    marginBottom: SIZES.padding,
  },
});

export default DepressionMeterScreen;
