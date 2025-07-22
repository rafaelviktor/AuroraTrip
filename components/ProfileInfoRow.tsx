import React from 'react';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';

interface ProfileInfoRowProps {
  label: string;
  value: string;
  isLast?: boolean;
}

export default function ProfileInfoRow({ label, value, isLast = false }: ProfileInfoRowProps) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const colors = {
    text: isDarkMode ? '#FFFFFF' : '#000000',
    label: isDarkMode ? '#b0b0b0' : '#666666',
    border: isDarkMode ? '#3a3a3c' : '#e0e0e0',
  };

  return (
    <View style={[
      styles.row, 
      { borderBottomColor: colors.border },
      isLast && styles.lastRow // Aplica o estilo 'lastRow' se isLast for true
    ]}>
      <Text style={[styles.label, { color: colors.label }]}>{label}</Text>
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
});