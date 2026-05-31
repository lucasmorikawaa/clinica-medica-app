import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/Firebase';

import { Card } from '../../components/Cards/Card';
import { Input } from '../../components/Inputs/Input';
import { Button } from '../../components/Buttons/Button';
import { styles } from './MedicosStyles';

type Medico = {
  id: string;
  nome: string;
  crm: string;
  especialidade: string;
  telefone: string;
};

export default function Medicos() {
  const navigation = useNavigation<any>();
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [busca, setBusca] = useState('');

  async function ler() {
    try {
      const querySnapshot = await getDocs(collection(db, 'Medicos'));
      const lista: Medico[] = [];
      querySnapshot.forEach((document) => {
        lista.push({ ...document.data(), id: document.id } as Medico);
      });
      setMedicos(lista);
    } catch (error) {
      console.log('Erro ao ler médicos:', error);
    }
  }

  async function excluir(id: string, nome: string) {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja excluir o médico ${nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'Medicos', id));
              console.log('Médico excluído:', id);
              ler();
            } catch (error) {
              console.log('Erro ao excluir médico:', error);
            }
          },
        },
      ]
    );
  }

  useFocusEffect(
    useCallback(() => {
      ler();
    }, [])
  );

  const medicosFiltrados = medicos.filter(
    (m) =>
      m.nome.toLowerCase().includes(busca.toLowerCase()) ||
      m.crm.includes(busca) ||
      m.especialidade.toLowerCase().includes(busca.toLowerCase())
  );

  const renderItem = ({ item }: { item: Medico }) => (
    <Card style={styles.medicoCard}>
      <View style={styles.cardHeader}>
        <View style={styles.infoContainer}>
          <Text style={styles.nome}>{item.nome}</Text>

          <View style={styles.iconRow}>
            <Ionicons name="medal-outline" size={16} color="#718096" />
            <Text style={styles.detalheText}>CRM: {item.crm}</Text>
          </View>

          <View style={styles.iconRow}>
            <Ionicons name="fitness-outline" size={16} color="#718096" />
            <Text style={styles.detalheText}>{item.especialidade}</Text>
          </View>

          <View style={styles.iconRow}>
            <Ionicons name="call-outline" size={16} color="#718096" />
            <Text style={styles.detalheText}>{item.telefone}</Text>
          </View>

          <View style={styles.badgeEspecialidade}>
            <Text style={styles.badgeText}>{item.especialidade}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => excluir(item.id, item.nome)}
          style={styles.btnExcluir}
        >
          <Ionicons name="trash-outline" size={20} color="#E53E3E" />
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.listHeader}>
          <View>
            <Text style={styles.titulo}>Médicos</Text>
            <Text style={styles.subtitulo}>
              {medicosFiltrados.length} cadastrados
            </Text>
          </View>

          <TouchableOpacity
            style={styles.btnNovo}
            onPress={() => navigation.navigate('NovoMedico')}
          >
            <Ionicons name="add" size={20} color="#FFF" />
            <Text style={styles.btnNovoTexto}>Novo</Text>
          </TouchableOpacity>
        </View>

        <Input
          placeholder="Buscar por nome, CRM ou especialidade..."
          iconName="search"
          value={busca}
          onChangeText={setBusca}
        />

        <FlatList
          data={medicosFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum médico cadastrado.</Text>
          }
        />

        <Button title="Atualizar Lista" variant="outline" onPress={ler} />
      </View>
    </View>
  );
}