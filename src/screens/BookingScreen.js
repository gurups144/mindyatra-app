import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import { COLORS, SIZES } from '../utils/constants';
import { apiService } from '../services/api';

const SPECIALISTS = [
  { id: '1', name: 'Dr. Sarah Johnson', specialty: 'Clinical Psychologist', rating: 4.8, price: 1500 },
  { id: '2', name: 'Dr. Michael Chen', specialty: 'Psychiatrist', rating: 4.9, price: 2000 },
  { id: '3', name: 'Dr. Priya Sharma', specialty: 'Counseling Psychologist', rating: 4.7, price: 1200 },
  { id: '4', name: 'Dr. James Wilson', specialty: 'Child Psychologist', rating: 4.6, price: 1800 },
];

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
];

const BookingScreen = ({ navigation }) => {
  const [step, setStep] = useState(1); // 1: Select Specialist, 2: Select Date/Time, 3: Confirmation
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [sessionType, setSessionType] = useState('video');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSelectSpecialist = (specialist) => {
    setSelectedSpecialist(specialist);
    setStep(2);
  };

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Required', 'Please select date and time');
      return;
    }

    setLoading(true);
    const bookingData = {
      specialistId: selectedSpecialist.id,
      date: selectedDate,
      time: selectedTime,
      sessionType,
      notes,
    };

    const response = await apiService.bookSession(bookingData);
    setLoading(false);

    if (response.success) {
      Alert.alert(
        'Success!',
        `Your session has been booked!\nBooking ID: ${response.bookingId}`,
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
      );
    } else {
      Alert.alert('Error', response.error || 'Failed to book session');
    }
  };

  // Step 1: Select Specialist
  if (step === 1) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Book a Session</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>Choose Your Specialist</Text>

          {SPECIALISTS.map((specialist) => (
            <TouchableOpacity
              key={specialist.id}
              style={styles.specialistCard}
              onPress={() => handleSelectSpecialist(specialist)}
            >
              <View style={styles.avatar}>
                <Ionicons name="person" size={32} color={COLORS.white} />
              </View>
              <View style={styles.specialistInfo}>
                <Text style={styles.specialistName}>{specialist.name}</Text>
                <Text style={styles.specialistSpecialty}>{specialist.specialty}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color={COLORS.warning} />
                  <Text style={styles.rating}>{specialist.rating}</Text>
                  <Text style={styles.price}>• ₹{specialist.price}/session</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={COLORS.gray} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  // Step 2: Select Date/Time
  if (step === 2) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} onPress={() => setStep(1)} />
          <Text style={styles.headerTitle}>Schedule Session</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content}>
          {/* Selected Specialist Info */}
          <View style={styles.selectedSpecialistCard}>
            <View style={styles.avatarSmall}>
              <Ionicons name="person" size={24} color={COLORS.white} />
            </View>
            <View style={styles.selectedInfo}>
              <Text style={styles.selectedName}>{selectedSpecialist.name}</Text>
              <Text style={styles.selectedSpecialty}>{selectedSpecialist.specialty}</Text>
            </View>
          </View>

          {/* Session Type */}
          <View style={styles.card}>
            <Text style={styles.label}>Session Type</Text>
            <View style={styles.sessionTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.sessionTypeButton,
                  sessionType === 'video' && styles.sessionTypeActive,
                ]}
                onPress={() => setSessionType('video')}
              >
                <Ionicons
                  name="videocam"
                  size={24}
                  color={sessionType === 'video' ? COLORS.white : COLORS.gray}
                />
                <Text
                  style={[
                    styles.sessionTypeText,
                    sessionType === 'video' && styles.sessionTypeTextActive,
                  ]}
                >
                  Video Call
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sessionTypeButton,
                  sessionType === 'audio' && styles.sessionTypeActive,
                ]}
                onPress={() => setSessionType('audio')}
              >
                <Ionicons
                  name="call"
                  size={24}
                  color={sessionType === 'audio' ? COLORS.white : COLORS.gray}
                />
                <Text
                  style={[
                    styles.sessionTypeText,
                    sessionType === 'audio' && styles.sessionTypeTextActive,
                  ]}
                >
                  Audio Call
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Date Selection */}
          <View style={styles.card}>
            <Text style={styles.label}>Select Date</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={selectedDate}
              onChangeText={setSelectedDate}
            />
          </View>

          {/* Time Slot Selection */}
          <View style={styles.card}>
            <Text style={styles.label}>Select Time</Text>
            <View style={styles.timeSlotsContainer}>
              {TIME_SLOTS.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeSlot,
                    selectedTime === time && styles.timeSlotActive,
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text
                    style={[
                      styles.timeSlotText,
                      selectedTime === time && styles.timeSlotTextActive,
                    ]}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Additional Notes */}
          <View style={styles.card}>
            <Text style={styles.label}>Additional Notes (Optional)</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Any specific concerns or topics you'd like to discuss..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Booking Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Specialist:</Text>
              <Text style={styles.summaryValue}>{selectedSpecialist.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Session Type:</Text>
              <Text style={styles.summaryValue}>{sessionType === 'video' ? 'Video Call' : 'Audio Call'}</Text>
            </View>
            {selectedDate && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Date:</Text>
                <Text style={styles.summaryValue}>{selectedDate}</Text>
              </View>
            )}
            {selectedTime && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Time:</Text>
                <Text style={styles.summaryValue}>{selectedTime}</Text>
              </View>
            )}
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotal}>Total:</Text>
              <Text style={styles.summaryTotalValue}>₹{selectedSpecialist.price}</Text>
            </View>
          </View>

          <Button
            title="Confirm Booking"
            onPress={handleConfirmBooking}
            loading={loading}
            style={styles.confirmButton}
          />
        </ScrollView>
      </View>
    );
  }

  return null;
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
    flex: 1,
    padding: SIZES.padding,
  },
  sectionTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SIZES.padding,
  },
  specialistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  specialistInfo: {
    flex: 1,
    marginLeft: SIZES.padding,
  },
  specialistName: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  specialistSpecialty: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    fontSize: SIZES.font,
    color: COLORS.dark,
    marginLeft: 4,
  },
  price: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    marginLeft: 4,
  },
  selectedSpecialistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '20',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
  },
  avatarSmall: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedInfo: {
    marginLeft: SIZES.padding,
  },
  selectedName: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  selectedSpecialty: {
    fontSize: SIZES.font,
    color: COLORS.gray,
    marginTop: 2,
  },
  card: {
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
  sessionTypeContainer: {
    flexDirection: 'row',
    gap: SIZES.padding,
  },
  sessionTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.padding,
    borderRadius: SIZES.radius / 2,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
  },
  sessionTypeActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sessionTypeText: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
    marginLeft: SIZES.base,
    fontWeight: '500',
  },
  sessionTypeTextActive: {
    color: COLORS.white,
    fontWeight: '600',
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
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.base,
  },
  timeSlot: {
    paddingVertical: SIZES.base,
    paddingHorizontal: SIZES.padding,
    borderRadius: SIZES.radius / 2,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
  },
  timeSlotActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  timeSlotText: {
    fontSize: SIZES.font,
    color: COLORS.dark,
  },
  timeSlotTextActive: {
    color: COLORS.white,
    fontWeight: '600',
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
  summaryCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SIZES.padding,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.base,
  },
  summaryLabel: {
    fontSize: SIZES.medium,
    color: COLORS.gray,
  },
  summaryValue: {
    fontSize: SIZES.medium,
    color: COLORS.dark,
    fontWeight: '500',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: SIZES.padding,
  },
  summaryTotal: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  summaryTotalValue: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  confirmButton: {
    marginBottom: SIZES.padding * 2,
  },
});

export default BookingScreen;
