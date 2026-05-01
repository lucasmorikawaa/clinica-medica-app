import React from 'react';
import { View, Text } from 'react-native';

import { styles } from './BadgeStatusStyles';

export type Status = 'L' | 'M' | 'C' | 'X' | 'B';

interface BadgeStatusProps {
  type: Status;
}

const statusMap = {
  C: { label: 'Confirmado', color: '#C6F6D5', textColor: '#22543D' },
  L: { label: 'Livre', color: '#BEE3F8', textColor: '#2A4365' },
  M: { label: 'Aguardando', color: '#FEEBC8', textColor: '#744210' },
  X: { label: 'Cancelado', color: '#FED7D7', textColor: '#822727' },
  B: { label: 'Bloqueado', color: '#E2E8F0', textColor: '#4A5568' },
};

export const BadgeStatus = ({ type }: BadgeStatusProps) => {
  const config = statusMap[type];

  return (
    <View style={[styles.container, { backgroundColor: config.color }]}>
      <Text style={[styles.text, { color: config.textColor }]}>
        {config.label}
      </Text>
    </View>
  );
};