// AddTransactionScreen.tsx

import { alertDetails } from '@/atom/global';
import { ThemedTextInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedTile } from '@/components/themed-tile';
import { ThemedView } from '@/components/themed-view';
import AppButton from '@/components/ui/appButton';
import { Colors } from '@/constants/theme';
import { createTransaction } from '@/data/transactions';
import { Formik } from 'formik';
import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Yup from 'yup';

const TransactionSchema = Yup.object().shape({
  amount: Yup.number().positive('Amount must be positive').required('Required'),
  type: Yup.string().oneOf(['income', 'expense']).required('Required'),
  category: Yup.string().oneOf(['food', 'entertainment', 'party', 'repaire', 'buying', 'others']).required('Required'),
  description: Yup.string().required('Required'),
});

const AddTransactionScreen = () => {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const theme = useColorScheme();
  const [alert, setAlert] = useAtom(alertDetails);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Food', value: 'food' },
    { label: 'Entertainment', value: 'entertainment' },
    { label: 'Party', value: 'party' },
    { label: 'Repaire', value: 'repaire' },
    { label: 'Buying', value: 'buying' },
    { label: 'Salary', value: 'salary' },
    { label: 'Others', value: 'others' },
  ]);
  const [isLoading, setLoading] = useState(false);
  const handleConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    setShowPicker(false);
  };

  return (
      <ThemedView style={{height: "100%"}} >
        <Formik
          initialValues={{
            amount: '',
            type: 'expense',
            category: 'food',
            description: '',
          }}
          validationSchema={TransactionSchema}
          onSubmit={async (values, { resetForm }) => {
            setLoading(true);
            await createTransaction({
              amount: parseFloat(values.amount),
              type: values.type as 'income' | 'expense',
              category: values.category as any,
              description: values.description,
              date: date.toISOString(),
            });
            setAlert({
              visible: true,
              message: 'Transaction saved',
              type: 'success',
              title: 'Success',
              onClose: () => {
                setLoading(false);
                setAlert(prev => ({ ...prev, visible: false }));
              },
            });
            resetForm();
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <ThemedTile style={styles.container}>
              <ThemedText style={styles.label}>Amount</ThemedText>
              <ThemedTextInput
                style={styles.input}
                keyboardType="numeric"
                onChangeText={handleChange('amount')}
                onBlur={handleBlur('amount')}
                value={values.amount}
                placeholder='0.00'
              />
              {touched.amount && errors.amount && <Text style={styles.error}>{errors.amount}</Text>}

              <ThemedText style={styles.label}>Type</ThemedText>
              <View style={styles.radioGroup}>
                {['income', 'expense'].map(option => (
                  <TouchableOpacity
                    key={option}
                    style={styles.radioOption}
                    onPress={() => setFieldValue('type', option)}
                  >
                    <View style={styles.radioCircle}>
                      {values.type === option && <View style={styles.radioDot} />}
                    </View>
                    <ThemedText>{option}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
              {touched.type && errors.type && <Text style={styles.error}>{errors.type}</Text>}

              <ThemedText style={styles.label}>Category</ThemedText>
              <DropDownPicker
                open={open}
                value={values.category}
                items={items}
                setOpen={setOpen}
                theme={theme === "light"? "LIGHT" : 'DARK'}
                setValue={val => setFieldValue('category', val())}
                setItems={setItems}
                placeholder="Select category"
                style={{
                  backgroundColor: theme === 'light' ? '#f0f0f0' : '#333',
                  borderColor: '#ccc',
                }}
                arrowIconStyle={{
                  // backgroundColor: "#fff",
                  borderRadius: 15,
                  
                }}
                textStyle={{
                  color: theme === 'light' ? '#000' : '#fff',
                }}
                tickIconStyle={{
                  // backgroundColor: "#fff"
                }}
                dropDownContainerStyle={{
                  backgroundColor: theme === 'light' ? '#fff' : '#222',
                  borderColor: '#ccc',
                }}
              />
              {touched.category && errors.category && <Text style={styles.error}>{errors.category}</Text>}

              <ThemedText style={styles.label}>Description</ThemedText>
              <ThemedTextInput
                style={styles.input}
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
                placeholder='Add some content about this Transaction'
              />
              {touched.description && errors.description && <Text style={styles.error}>{errors.description}</Text>}

              <ThemedText style={styles.label}>Date & Time</ThemedText>
              <Button
                title={date.toLocaleString()}
                style={{
                  width: "100%",
                  alignSelf: 'center'
                }}
              onPress={() => setShowPicker(true)} />
              <DateTimePickerModal
                isVisible={showPicker}
                mode="datetime"
                date={date}
                onConfirm={handleConfirm}
                onCancel={() => setShowPicker(false)}
                style={{
                  backgroundColor: Colors.primary
                }}
              />

              <AppButton
                onPress={handleSubmit as any}
                disabled={isLoading}
                type="primary" style={{marginTop: 25 , width: "100%", alignSelf:"center"}} >
                {isLoading ? 
                <ActivityIndicator 
                  color={"#fff"}
                  size={24}
                />
                        :
                <ThemedText
                  type="subtitle"
                  style={{ color: '#fff' }}
                  
                >
                  Add Transaction
                </ThemedText>

                }
              </AppButton>
            </ThemedTile>
          )}
        </Formik>
      </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { margin: 20 },
  label: { marginTop: 10, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 4 },
  error: { color: 'red', fontSize: 12 },
  submitButton: { marginTop: 20 },
  radioGroup: {
    flexDirection: 'row',
    gap: 20,
    marginVertical: 8,
    alignItems: 'center',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
});

export default AddTransactionScreen;
