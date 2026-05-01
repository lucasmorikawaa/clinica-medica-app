import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

import { styles } from './ButtonStyles';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'outline';
}

export const Button = ({ title, variant = 'primary', style, ...rest }: ButtonProps) => {
  return (
    <TouchableOpacity 
      style={[styles.container, styles[variant], style]} 
      activeOpacity={0.7}
      {...rest}
    >
      <Text style={[styles.text, variant === 'outline' && styles.textOutline]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};