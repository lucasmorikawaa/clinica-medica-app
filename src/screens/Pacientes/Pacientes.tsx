import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '../../components/Cards/Card';
import { Input } from '../../components/Inputs/Input';
import { Button } from '../../components/Buttons/Button';
import { styles } from './PacientesStyles';

type Paciente = {
  id: string;
  nome: string;
  telefone: string;
  dataNascimento: string;
  convenio: string;
};

const MOCK_PACIENTES: Paciente[] = [
  { id: '1', nome: 'Maria Silva Santos', telefone: '(11) 98765-4321', dataNascimento: '14/03/1985', convenio: 'Unimed' },
  { id: '2', nome: 'João Pedro Oliveira', telefone: '(11) 91234-5678', dataNascimento: '21/07/1990', convenio: 'Bradesco Saúde' },
  { id: '3', nome: 'Ana Carolina Souza', telefone: '(11) 99999-0000', dataNascimento: '30/05/1992', convenio: 'Particular' },
];

export default function Pacientes() {
  const navigation = useNavigation<any>();

  const renderItem = ({ item }: { item: Paciente }) => (
    <Card style={styles.pacienteCard}>
      <View style={styles.cardHeader}>
        <View style={styles.infoContainer}>
          <Text style={styles.nome}>{item.nome}</Text>
          
          <View style={styles.iconRow}>
            <Ionicons name="call-outline" size={16} color="#718096" />
            <Text style={styles.detalheText}>{item.telefone}</Text>
          </View>
          
          <View style={styles.iconRow}>
            <Ionicons name="calendar-outline" size={16} color="#718096" />
            <Text style={styles.detalheText}>{item.dataNascimento}</Text>
          </View>

          <View style={styles.badgeConvenio}>
            <Text style={styles.badgeText}>{item.convenio}</Text>
          </View>
        </View>

        <Button 
          title="Ver Detalhes" 
          variant="outline" 
          onPress={() => {}} 
          style={styles.botaoDetalhes}
        />
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>

      <View style={styles.content}>
        <View style={styles.listHeader}>
          <View>
            <Text style={styles.titulo}>Pacientes</Text>
            <Text style={styles.subtitulo}>{MOCK_PACIENTES.length} cadastrados</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.btnNovo} 
            onPress={() => navigation.navigate('NovoPaciente')}
          >
            <Ionicons name="add" size={20} color="#FFF" />
            <Text style={styles.btnNovoTexto}>Novo</Text>
          </TouchableOpacity>
        </View>

        <Input 
          placeholder="Buscar por nome ou CPF..." 
          iconName="search"
        />

        <FlatList
          data={MOCK_PACIENTES}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}