import React from 'react';
import { View, ViewProps } from 'react-native';

import { styles } from './CardStyles';

interface CardProps extends ViewProps {
  statusColor?: string;
}

export const Card = ({ children, statusColor, style, ...rest }: CardProps) => {
  return (
    <View style={[styles.card, style, statusColor ? { borderLeftColor: statusColor, borderLeftWidth: 4 } : null]} {...rest}>
      {children}
    </View>
  );
};