import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import {
  addDoc,
  collection
} from 'firebase/firestore';

import { db } from '../../config/Firebase';

import { Input } from '../../components/Inputs/Input';
import { Button } from '../../components/Buttons/Button';
import { Card } from '../../components/Cards/Card';

import { styles } from './CadastrarPacienteStyles';

export default function CadastrarPaciente() {

  const navigation = useNavigation<any>();

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [convenio, setConvenio] = useState('');

  async function handleSalvar() {

    if (!nome || !cpf || !dataNascimento || !telefone) {
      Alert.alert(
        'Erro',
        'Por favor, preencha os campos obrigatórios.'
      );
      return;
    }

    try {

      await addDoc(
        collection(db, 'Pacientes'),
        {
          nome,
          cpf,
          telefone,
          dataNascimento,
          convenio
        }
      );

      Alert.alert(
        'Sucesso',
        `Paciente ${nome} cadastrado com sucesso!`
      );

      setNome('');
      setCpf('');
      setDataNascimento('');
      setTelefone('');
      setConvenio('');

      navigation.navigate('ListaPacientes');

    } catch (error) {

      console.log(error);

      Alert.alert(
        'Erro',
        'Não foi possível cadastrar o paciente.'
      );
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : 'height'
      }
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <Text style={styles.title}>Novo Paciente</Text>
        <Text style={styles.subtitle}>
          Preencha os dados do paciente
        </Text>

        <Card style={styles.formCard}>

          <Input
            label="Nome Completo *"
            placeholder="Nome do paciente"
            value={nome}
            onChangeText={setNome}
          />

          <Input
            label="CPF *"
            placeholder="000.000.000-00"
            value={cpf}
            onChangeText={setCpf}
          />

          <Input
            label="Data de Nascimento *"
            placeholder="dd/mm/aaaa"
            value={dataNascimento}
            onChangeText={setDataNascimento}
          />

          <Input
            label="Telefone *"
            placeholder="(11) 99999-9999"
            value={telefone}
            onChangeText={setTelefone}
          />

          <Input
            label="Convênio"
            placeholder="Unimed, Particular..."
            value={convenio}
            onChangeText={setConvenio}
          />

          <View style={[styles.row, { marginTop: 16 }]}>

            <Button
              title="Cancelar"
              variant="outline"
              style={{ flex: 1, marginRight: 8 }}
              onPress={() =>
                navigation.navigate('ListaPacientes')
              }
            />

            <Button
              title="Cadastrar Paciente"
              style={{ flex: 1.5 }}
              onPress={handleSalvar}
            />

          </View>

        </Card>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}