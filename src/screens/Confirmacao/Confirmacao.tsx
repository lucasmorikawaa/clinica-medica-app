import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function Confirmacao({ navigation }: any) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>✅ Consulta Agendada!</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Agendamento')}>
        <Text>Novo Agendamento</Text>
      </TouchableOpacity>
    </View>
  );
}