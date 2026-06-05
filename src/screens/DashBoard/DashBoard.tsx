import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/Cards/Card';
import { styles } from './DashBoardStyles';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
}

const StatCard = ({ title, value, icon, iconColor }: StatCardProps) => (
  <Card style={styles.statCard}>
    <View style={[styles.iconContainer, { backgroundColor: iconColor + '15' }]}>
      <Ionicons name={icon} size={24} color={iconColor} />
    </View>
    <Text style={styles.statTitle}>{title}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </Card>
);

export default function DashBoard() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Visão geral da clínica</Text>
        </View>

        <View style={styles.statsGrid}>
          <StatCard 
            title="Consultas Hoje" 
            value="3" 
            icon="calendar" 
            iconColor="#1A5CFF" 
          />
          <StatCard 
            title="Confirmadas" 
            value="2" 
            icon="person-add" 
            iconColor="#10B981" 
          />
          <StatCard 
            title="Pendentes" 
            value="1" 
            icon="time" 
            iconColor="#F59E0B" 
          />
          <StatCard 
            title="Canceladas" 
            value="0" 
            icon="close-circle" 
            iconColor="#EF4444" 
          />
        </View>

        <Card style={styles.shortcutsCard}>
          <Text style={styles.sectionTitle}>Atalhos Rápidos</Text>
          
          <TouchableOpacity style={[styles.shortcutItem, { backgroundColor: '#EBF2FF' }]}>
            <Text style={[styles.shortcutText, { color: '#1A5CFF' }]}>Agendar Consulta</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.shortcutItem, { backgroundColor: '#E6FFFA' }]}>
            <Text style={[styles.shortcutText, { color: '#047481' }]}>Confirmar Consultas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.shortcutItem, { backgroundColor: '#FAF5FF' }]}>
            <Text style={[styles.shortcutText, { color: '#6B46C1' }]}>Atender Paciente</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </View>
  );
}