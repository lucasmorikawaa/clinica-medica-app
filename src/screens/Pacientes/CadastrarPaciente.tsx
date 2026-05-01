import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Alert, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { Input } from '../../components/Inputs/Input';
import { Button } from '../../components/Buttons/Button';
import { Card } from '../../components/Cards/Card';
import { styles } from './CadastrarPacienteStyles';

interface Paciente {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  convenio?: string;
}

export const CadastrarPaciente = () => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [convenio, setConvenio] = useState('');

  const [pacientes, setPacientes] = useState<Paciente[]>([]);

  const handleSalvar = () => {
    if (!nome || !cpf || !dataNascimento || !telefone) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const novoPaciente: Paciente = {
      id: Math.random().toString(36).substr(2, 9),
      nome,
      cpf,
      dataNascimento,
      telefone,
      convenio
    };

    setPacientes([...pacientes, novoPaciente]);
    
    Alert.alert('Sucesso', `Paciente ${nome} cadastrado com sucesso!`);
    
    setNome('');
    setCpf('');
    setDataNascimento('');
    setTelefone('');
    setConvenio('');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Novo Paciente</Text>
        <Text style={styles.subtitle}>Preencha os dados do paciente</Text>

        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Dados Pessoais</Text>

          <Input 
            label="Nome Completo *" 
            placeholder="Nome do paciente"
            value={nome}
            onChangeText={setNome}
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Input 
                label="CPF *" 
                placeholder="000.000.000-00"
                keyboardType="numeric"
                value={cpf}
                onChangeText={setCpf}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input label="RG" placeholder="00.000.000-0" keyboardType="numeric" />
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Input 
                label="Data de Nascimento *" 
                placeholder="dd/mm/aaaa"
                value={dataNascimento}
                onChangeText={setDataNascimento}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input label="Sexo" placeholder="Selecione" />
            </View>
          </View>

          <Input 
            label="Telefone *" 
            placeholder="(00) 00000-0000"
            keyboardType="phone-pad"
            value={telefone}
            onChangeText={setTelefone}
          />

          <Input label="Endereço" placeholder="Rua, número - Cidade, Estado" />

          <Input 
            label="Convênio" 
            placeholder="Particular, Unimed, etc."
            value={convenio}
            onChangeText={setConvenio}
          />

          <View style={[styles.row, { marginTop: 16 }]}>
            <Button 
              title="Cancelar" 
              variant="outline" 
              style={{ flex: 1, marginRight: 8 }} 
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
};