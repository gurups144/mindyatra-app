import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import { COLORS, SIZES } from '../utils/constants';
import { apiService } from '../services/api';

const UnarathmaScreen = ({ navigation }) => {
  const [step, setStep] = useState(1); // 1: Form, 2: Report
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    symptoms: '',
    duration: '',
    lifestyle: '',
    medicalHistory: '',
  });
  const [report, setReport] = useState(null);
  const [contactMessage, setContactMessage] = useState('');

  const handleSubmit = async () => {
    if (!formData.symptoms || !formData.duration) {
      Alert.alert('Required Fields', 'Please fill in symptoms and duration');
      return;
    }

    setLoading(true);
    const response = await apiService.submitUnarathmaRequest(formData);
    setLoading(false);

    if (response.success) {
      setReport(response.data);
      setStep(2);
    } else {
      Alert.alert('Error', response.error || 'Failed to process request');
    }
  };

  const handleContactDoctor = async () => {
    if (!contactMessage.trim()) {
      Alert.alert('Message Required', 'Please enter a message for the doctor');
      return;
    }

    setLoading(true);
    const response = await apiService.contactDoctor(report.reportId, contactMessage);
    setLoading(false);

    if (response.success) {
      Alert.alert('Success', response.message);
      setContactMessage('');
    } else {
      Alert.alert('Error', response.error || 'Failed to contact doctor');
    }
  };

  if (step === 2 && report) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={[styles.content, { marginTop: 16 }]}>
          {/* Report ID */}
          <View style={styles.reportIdCard}>
            <Text style={styles.reportIdLabel}>Report ID</Text>
            <Text style={styles.reportId}>{report.reportId}</Text>
          </View>

          {/* AI Analysis */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="analytics" size={28} color={COLORS.primary} />
              <Text style={styles.cardTitle}>AI Analysis Report</Text>
            </View>
            <Text style={styles.analysisText}>{report.aiReport.analysis}</Text>
            
            <View style={styles.divider} />
            
            <Text style={styles.sectionTitle}>AI Recommendations:</Text>
            {report.aiReport.recommendations.map((rec, index) => (
              <View key={index} style={styles.recommendationItem}>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                <Text style={styles.recommendationText}>{rec}</Text>
              </View>
            ))}
          </View>

          {/* Doctor Consultation */}
          {report.doctorRequired && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="medical" size={28} color={COLORS.danger} />
                <Text style={styles.cardTitle}>Doctor Consultation Required</Text>
              </View>
              <Text style={styles.warningText}>
                Based on your inputs, we recommend consulting with a mental health professional.
              </Text>
              
              <View style={styles.contactDoctorSection}>
                <Text style={styles.label}>Message to Doctor:</Text>
                <TextInput
                  style={styles.messageInput}
                  placeholder="Describe your concerns or questions..."
                  value={contactMessage}
                  onChangeText={setContactMessage}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                <Button
                  title="Contact Doctor"
                  onPress={handleContactDoctor}
                  loading={loading}
                  variant="secondary"
                />
              </View>
            </View>
          )}

          {/* Timeline Info */}
          <View style={styles.infoCard}>
            <Ionicons name="time" size={24} color={COLORS.info} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Estimated Review Time</Text>
              <Text style={styles.infoText}>{report.estimatedTime}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <Button
            title="Book Session with Professional"
            onPress={() => navigation.navigate('Booking')}
            style={styles.actionButton}
          />
          <Button
            title="Back to Home"
            onPress={() => navigation.navigate('Home')}
            variant="outline"
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        {/* Service Info */}
        <View style={styles.serviceInfo}>
          <Ionicons name="medical" size={48} color={COLORS.secondary} />
          <Text style={styles.serviceTitle}>Comprehensive Mental Health Assessment</Text>
          <Text style={styles.serviceDescription}>
            Get AI-powered analysis combined with expert doctor review. Our service provides detailed reports and direct access to mental health professionals.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>What's Included:</Text>
          {[
            'AI-powered mental health analysis',
            'Detailed psychological assessment report',
            'Doctor review and recommendations',
            'Direct communication with specialists',
            'Follow-up support',
          ].map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* Form */}
        <View style={styles.card}>
          <Text style={styles.formTitle}>Assessment Form</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Symptoms *</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Describe your symptoms in detail..."
              value={formData.symptoms}
              onChangeText={(text) => setFormData({ ...formData, symptoms: text })}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Duration *</Text>
            <TextInput
              style={styles.input}
              placeholder="How long have you experienced these symptoms?"
              value={formData.duration}
              onChangeText={(text) => setFormData({ ...formData, duration: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Lifestyle & Daily Routine</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Sleep patterns, diet, exercise, work schedule..."
              value={formData.lifestyle}
              onChangeText={(text) => setFormData({ ...formData, lifestyle: text })}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Medical History</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Previous diagnoses, medications, treatments..."
              value={formData.medicalHistory}
              onChangeText={(text) => setFormData({ ...formData, medicalHistory: text })}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <Button
            title="Submit Assessment"
            onPress={handleSubmit}
            loading={loading}
          />
        </View>

        {/* Privacy Note */}
        <View style={styles.privacyNote}>
          <Ionicons name="lock-closed" size={20} color={COLORS.gray} />
          <Text style={styles.privacyText}>
            Your information is confidential and protected. Only licensed professionals will have access to your assessment.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingVertical: 16,
  },
  content: {
    padding: SIZES.padding,
    paddingTop: 0,
  },
  serviceInfo: {
    backgroundColor: COLORS.secondary + '20',
    padding: SIZES.padding * 1.5,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  serviceTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.dark,
    textAlign: 'center',
    marginTop: SIZES.padding,
    marginBottom: SIZES.base,
  },
  serviceDescription: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
  featuresCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    elevation: 2,
  },
  featuresTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SIZES.padding,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  featureText: {
    fontSize: SIZES.medium,
    color: COLORS.dark,
    marginLeft: SIZES.base,
  },
  card: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    elevation: 2,
  },
  formTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SIZES.padding,
  },
  inputGroup: {
    marginBottom: SIZES.padding,
  },
  label: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SIZES.base,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius / 2,
    padding: SIZES.padding,
    fontSize: SIZES.medium,
    color: COLORS.dark,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  textArea: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius / 2,
    padding: SIZES.padding,
    fontSize: SIZES.medium,
    color: COLORS.dark,
    minHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding,
    backgroundColor: COLORS.light,
    borderRadius: SIZES.radius,
  },
  privacyText: {
    flex: 1,
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginLeft: SIZES.base,
    lineHeight: 18,
  },
  reportIdCard: {
    backgroundColor: COLORS.primary + '20',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  reportIdLabel: {
    fontSize: SIZES.font,
    color: COLORS.gray,
  },
  reportId: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.padding,
  },
  cardTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginLeft: SIZES.base,
  },
  analysisText: {
    fontSize: SIZES.medium,
    color: COLORS.dark,
    lineHeight: 24,
    marginBottom: SIZES.padding,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: SIZES.padding,
  },
  sectionTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SIZES.base,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.base,
  },
  recommendationText: {
    flex: 1,
    fontSize: SIZES.medium,
    color: COLORS.dark,
    marginLeft: SIZES.base,
  },
  warningText: {
    fontSize: SIZES.medium,
    color: COLORS.danger,
    lineHeight: 22,
    marginBottom: SIZES.padding,
  },
  contactDoctorSection: {
    marginTop: SIZES.padding,
  },
  messageInput: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius / 2,
    padding: SIZES.padding,
    fontSize: SIZES.medium,
    color: COLORS.dark,
    minHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    marginBottom: SIZES.padding,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.info + '20',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
  },
  infoContent: {
    marginLeft: SIZES.base,
    flex: 1,
  },
  infoTitle: {
    fontSize: SIZES.medium,
    fontWeight: '600',
    color: COLORS.dark,
  },
  infoText: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    marginTop: 4,
  },
  actionButton: {
    marginBottom: SIZES.padding,
  },
});

export default UnarathmaScreen;
