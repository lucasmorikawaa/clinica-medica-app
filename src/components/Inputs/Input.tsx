import React from 'react';
import { View, TextInput, Text,TextInputProps } from 'react-native';

import { styles } from './InputStyles';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
}

export const Input = ({ label, iconName, ...rest }: InputProps) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        {iconName && <Ionicons name={iconName} size={20} color="#A0AEC0" style={styles.icon} />}
        <TextInput 
          style={styles.input} 
          placeholderTextColor="#A0AEC0"
          {...rest} 
        />
      </View>
    </View>
  );
};