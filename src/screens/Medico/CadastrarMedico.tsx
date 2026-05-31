import React, { useState } from 'react';
import {View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/Firebase';

import { Input } from '../../components/Inputs/Input';
import { Button } from '../../components/Buttons/Button';
import { Card } from '../../components/Cards/Card';
import { styles } from './CadastrarMedicoStyles';

export default function CadastrarMedico() {
  const navigation = useNavigation<any>();

  const [nome, setNome] = useState('');
  const [crm, setCrm] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [telefone, setTelefone] = useState('');

  async function cadastrar() {
    if (!nome.trim() || !crm.trim() || !especialidade.trim() || !telefone.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      await addDoc(collection(db, 'Medicos'), {
        nome,
        crm,
        especialidade,
        telefone,
      });

      Alert.alert('Sucesso', `Médico ${nome} cadastrado com sucesso!`);

      setNome('');
      setCrm('');
      setEspecialidade('');
      setTelefone('');

      navigation.navigate('ListaMedicos');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cadastrar o médico.');
      console.log('Erro ao cadastrar médico:', error);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Novo Médico</Text>
        <Text style={styles.subtitle}>Preencha os dados do médico</Text>

        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Dados Profissionais</Text>

          <Input
            label="Nome Completo *"
            placeholder="Nome do médico"
            value={nome}
            onChangeText={setNome}
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Input
                label="CRM *"
                placeholder="00000"
                keyboardType="numeric"
                value={crm}
                onChangeText={setCrm}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                label="Especialidade *"
                placeholder="Ex: Cardiologia"
                value={especialidade}
                onChangeText={setEspecialidade}
              />
            </View>
          </View>

          <Input
            label="Telefone *"
            placeholder="(00) 00000-0000"
            keyboardType="phone-pad"
            value={telefone}
            onChangeText={setTelefone}
          />

          <View style={[styles.row, { marginTop: 16 }]}>
            <Button
              title="Cancelar"
              variant="outline"
              style={{ flex: 1, marginRight: 8 }}
              onPress={() => navigation.navigate('ListaMedicos')}
            />
            <Button
              title="Cadastrar Médico"
              style={{ flex: 1.5 }}
              onPress={cadastrar}
            />
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
