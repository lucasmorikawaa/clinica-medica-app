import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { styles } from './PacientesStyles';

type Paciente = {
  id: string;
  nome: string;
  telefone: string;
};

const MOCK_PACIENTES: Paciente[] = [
  { id: '1', nome: 'Enzo Aguiar', telefone: '(11) 98765-4321' },
  { id: '2', nome: 'Lucas Keiji', telefone: '(11) 91234-5678' },
  { id: '3', nome: 'Lucas Vieira', telefone: '(11) 99999-0000' },
  { id: '4', nome: 'Vitor Soler', telefone: '(11) 98888-1111' },
  { id: '5', nome: 'Fernanda Lima', telefone: '(11) 97777-2222' },
  { id: '6', nome: 'Roberto Alves', telefone: '(11) 96123-3333' },
  { id: '7', nome: 'Juliana Mendes', telefone: '(11) 95555-4444' },
  { id: '8', nome: 'Lucas Barbosa', telefone: '(11) 94444-5555' },
  { id: '9', nome: 'Beatriz Rocha', telefone: '(11) 93333-6666' }
];

export default function Pacientes() {
  const handlePress = (paciente: Paciente) => {
    Alert.alert('Detalhes/Agendamento', paciente.nome);
  };

  const renderItem = ({ item }: { item: Paciente }) => (
    <TouchableOpacity 
      style={styles.item} 
      onPress={() => handlePress(item)}
    >
      <Text style={styles.nome}>{item.nome}</Text>
      <Text style={styles.telefone}>{item.telefone}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_PACIENTES}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}