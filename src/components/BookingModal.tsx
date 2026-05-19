import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { createBooking } from '../services/firestoreService';

interface Props {
  visible: boolean;
  businessId: string;
  businessName: string;
  onClose: () => void;
}

export function BookingModal({ visible, businessId, businessName, onClose }: Props) {
  // Step Management
  const [step, setStep] = useState<1 | 2>(1);
  const [otpCode, setOtpCode] = useState('');

  // Form Data
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState<'date' | 'time'>('date');
  const [showPicker, setShowPicker] = useState(false);
  const [dateSelected, setDateSelected] = useState(false);
  const [partySize, setPartySize] = useState('2');
  const [showPartyPicker, setShowPartyPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios'); 
    setDate(currentDate);
    setDateSelected(true);
    
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (mode === 'date' && event.type === 'set') {
        setMode('time');
        setShowPicker(true);
      }
    }
  };

  const showMode = (currentMode: 'date' | 'time') => {
    setShowPicker(true);
    setMode(currentMode);
  };

  const handleDatePress = () => {
    showMode('date');
  };

  const formatDateString = () => {
    if (!dateSelected) return "Tarih ve Saat Seçiniz *";
    return date.toLocaleString('tr-TR', { 
      day: 'numeric', month: 'short', year: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    });
  };

  // 1. Aşama: Bilgileri kontrol et ve SMS gönder (Simüle edilmiş)
  const handleSendSMS = () => {
    if (!customerName || !customerPhone || !dateSelected || !partySize) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm zorunlu alanları doldurun.');
      return;
    }
    
    setLoading(true);
    // Simüle edilmiş SMS bekleme süresi
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1200);
  };

  // 2. Aşama: OTP'yi doğrula ve veritabanına kaydet
  const handleVerifyOTP = async () => {
    if (otpCode !== '123456') {
      Alert.alert('Hatalı Kod', 'Lütfen doğru doğrulama kodunu giriniz. (Test Kodu: 123456)');
      return;
    }

    setLoading(true);
    try {
      await createBooking({
        businessId,
        businessName,
        customerName,
        customerPhone,
        date: formatDateString(),
        partySize: parseInt(partySize, 10) || 1,
      });
      Alert.alert('Başarılı', 'Rezervasyon talebiniz alındı ve telefonunuz doğrulandı! İşletme sizinle iletişime geçecektir.');
      
      // Formu Sıfırla
      setCustomerName(''); 
      setCustomerPhone(''); 
      setDate(new Date()); 
      setDateSelected(false); 
      setPartySize('2');
      setOtpCode('');
      setStep(1);
      
      onClose();
    } catch (error) {
      console.error(error);
      Alert.alert('Hata', 'Rezervasyon oluşturulamadı. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Kapatıldığında her şeyi sıfırla
    setStep(1);
    setOtpCode('');
    onClose();
  };

  const partyOptions = Array.from({ length: 30 }, (_, i) => (i + 1).toString());

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView 
        style={styles.overlay} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Rezervasyon Talebi</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.subtitle}>{businessName} için rezervasyon yapın.</Text>

          {step === 1 ? (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.form}>
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.input}
                  placeholder="Adınız Soyadınız *"
                  placeholderTextColor={Colors.textTertiary}
                  value={customerName}
                  onChangeText={setCustomerName}
                />
              </View>

              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.input}
                  placeholder="Telefon Numaranız *"
                  placeholderTextColor={Colors.textTertiary}
                  keyboardType="phone-pad"
                  value={customerPhone}
                  onChangeText={setCustomerPhone}
                />
              </View>

              <View style={styles.inputGroup}>
                <TouchableOpacity style={styles.pickerButton} onPress={handleDatePress}>
                  <Text style={[styles.pickerButtonText, !dateSelected && { color: Colors.textTertiary }]}>
                    {formatDateString()}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {showPicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={mode}
                  is24Hour={true}
                  minuteInterval={30}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onChangeDate}
                  minimumDate={new Date()}
                  textColor={Colors.textPrimary}
                />
              )}
              
              {Platform.OS === 'ios' && showPicker && (
                 <TouchableOpacity 
                   style={styles.iosPickerDoneBtn} 
                   onPress={() => {
                     setShowPicker(false);
                     if(mode === 'date') showMode('time');
                   }}
                 >
                   <Text style={styles.iosPickerDoneText}>{mode === 'date' ? 'Saati Seç' : 'Tamam'}</Text>
                 </TouchableOpacity>
              )}

              <View style={styles.inputGroup}>
                <TouchableOpacity style={styles.pickerButton} onPress={() => setShowPartyPicker(true)}>
                  <Text style={styles.pickerButtonText}>
                    {partySize} Kişi
                  </Text>
                  <Ionicons name="people-outline" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                onPress={handleSendSMS}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text style={styles.submitText}>Doğrulama Kodu Gönder</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          ) : (
            // 2. AŞAMA: SMS OTP EKRANI
            <View style={styles.otpContainer}>
              <Ionicons name="chatbubble-ellipses-outline" size={48} color={Colors.primary} style={styles.otpIcon} />
              <Text style={styles.otpTitle}>Doğrulama Kodu</Text>
              <Text style={styles.otpDesc}>
                {customerPhone} numarasına gönderilen 6 haneli kodu giriniz. (Test Kodu: 123456)
              </Text>
              
              <TextInput
                style={styles.otpInput}
                placeholder="123456"
                placeholderTextColor={Colors.textTertiary}
                keyboardType="number-pad"
                maxLength={6}
                value={otpCode}
                onChangeText={setOtpCode}
                textAlign="center"
              />

              <TouchableOpacity 
                style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                onPress={handleVerifyOTP}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text style={styles.submitText}>Doğrula ve Gönder</Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.backToStep1Btn} onPress={() => setStep(1)} disabled={loading}>
                <Text style={styles.backToStep1Text}>Numarayı Değiştir</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Kişi Sayısı Modal'ı */}
        <Modal visible={showPartyPicker} transparent={true} animationType="fade">
          <TouchableOpacity style={styles.partyModalOverlay} onPress={() => setShowPartyPicker(false)} activeOpacity={1}>
            <View style={styles.partyModalContainer}>
              <Text style={styles.partyModalTitle}>Kişi Sayısı Seçin</Text>
              <FlatList
                data={partyOptions}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.partyOption}
                    onPress={() => {
                      setPartySize(item);
                      setShowPartyPicker(false);
                    }}
                  >
                    <Text style={[styles.partyOptionText, partySize === item && styles.partyOptionTextSelected]}>
                      {item} Kişi
                    </Text>
                    {partySize === item && <Ionicons name="checkmark" size={20} color={Colors.primary} />}
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
              />
              <TouchableOpacity style={styles.partyModalClose} onPress={() => setShowPartyPicker(false)}>
                <Text style={styles.partyModalCloseText}>Kapat</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.xl,
    maxHeight: '90%',
    ...Shadows.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.h2,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  subtitle: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  form: {
    paddingBottom: Spacing.xxl,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.body,
    color: Colors.textPrimary,
  },
  pickerButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerButtonText: {
    fontSize: Typography.body,
    color: Colors.textPrimary,
  },
  iosPickerDoneBtn: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  iosPickerDoneText: {
    color: Colors.primary,
    fontWeight: Typography.bold,
    fontSize: Typography.body,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: '#FFF',
    fontSize: Typography.body,
    fontWeight: Typography.bold,
  },
  // OTP Styles
  otpContainer: {
    paddingBottom: Spacing.xxl,
    alignItems: 'center',
  },
  otpIcon: {
    marginBottom: Spacing.md,
  },
  otpTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  otpDesc: {
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  otpInput: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    fontSize: 24,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    letterSpacing: 8,
    width: '80%',
    marginBottom: Spacing.xl,
  },
  backToStep1Btn: {
    marginTop: Spacing.lg,
    padding: Spacing.sm,
  },
  backToStep1Text: {
    color: Colors.textTertiary,
    fontSize: Typography.bodySmall,
    fontWeight: Typography.medium,
  },
  // Kişi Sayısı Modal Stilleri
  partyModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  partyModalContainer: {
    backgroundColor: '#FFF',
    width: '80%',
    maxHeight: '60%',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.lg,
  },
  partyModalTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  partyOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  partyOptionText: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
  },
  partyOptionTextSelected: {
    color: Colors.primary,
    fontWeight: Typography.bold,
  },
  partyModalClose: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  partyModalCloseText: {
    color: Colors.primary,
    fontWeight: Typography.bold,
    fontSize: Typography.body,
  },
});
