// Lembre-se de adicionar estes mapeamentos ao seu arquivo 'IconSymbol.tsx'
// 'chevron.down': 'keyboard-arrow-down',
// 'chevron.up': 'keyboard-arrow-up',

import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { IconSymbol } from './ui/IconSymbol'; // Ajuste o caminho se necessário

interface PickerItem {
  label: string;
  value: string | undefined;
}

interface PickerInputProps {
  label: string;
  items: PickerItem[];
  selectedValue: string | undefined;
  onValueChange: (value: string | undefined) => void;
  placeholder?: string;
}

export default function PickerInput({ label, items, selectedValue, onValueChange, placeholder = "Selecione..." }: PickerInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const colors = {
    text: isDarkMode ? '#FFFFFF' : '#000000',
    placeholder: isDarkMode ? '#AAAAAA' : '#8e8e8f',
    border: isDarkMode ? '#555555' : 'gray',
    background: isDarkMode ? '#1c1c1e' : '#FFFFFF',
    dropdownBg: isDarkMode ? '#2c2c2e' : '#f2f2f2',
    separator: isDarkMode ? '#3a3a3c' : '#e0e0e0',
  };

  const selectedLabel = items.find(item => item.value === selectedValue)?.label || placeholder;

  const handleSelect = (item: PickerItem) => {
    onValueChange(item.value);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <TouchableOpacity
        style={[styles.input, { borderColor: colors.border, backgroundColor: colors.background }]}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={[styles.inputText, { color: selectedValue ? colors.text : colors.placeholder }]}>
          {selectedLabel}
        </Text>
        <IconSymbol name={isOpen ? 'chevron.up' : 'chevron.down'} size={22} color={colors.placeholder} />
      </TouchableOpacity>

      {isOpen && (
        <View style={[styles.dropdown, { backgroundColor: colors.dropdownBg, borderColor: colors.border }]}>
          <FlatList
            data={items}
            keyExtractor={(item) => item.value || 'placeholder'}
            nestedScrollEnabled={true}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleSelect(item)}
              >
                <Text style={{ color: colors.text }}>{item.label}</Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.separator }]} />}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: {
    fontSize: 16,
  },
  dropdown: {
    position: 'absolute',
    top: 86,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 5,
    maxHeight: 200,
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 15,
  },
  separator: {
    height: 1,
  },
});
