import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './HeaderStyles';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export const Header = ({ 
  title = "Clínica Médica", 
  showBackButton = false, 
  onBackPress 
}: HeaderProps) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />
      <View style={styles.content}>
        {showBackButton && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTexto}>{title}</Text>
      </View>
    </View>
  );
};