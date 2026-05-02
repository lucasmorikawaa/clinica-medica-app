import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import styles from './AtendimentoStyles';

type Consulta = {
  id: string;
  paciente: string;
  medico: string;
  horario: string;
  convenio: string;
  status: 'Confirmado';
  dataNascimento: string;
  sexo: string;
  historico: string;
  laudo: string;
  receita: string;
};

const consultasMock: Consulta[] = [
  {
    id: '1',
    paciente: 'João Pedro Oliveira',
    medico: 'Dra. Julia Ferreira',
    horario: '10:00',
    convenio: 'Bradesco Saúde',
    status: 'Confirmado',
    dataNascimento: '21/07/1990',
    sexo: 'Masculino',
    historico: 'Consultas anteriores disponíveis no histórico completo',
    laudo: '',
    receita: '',
  },
  {
    id: '2',
    paciente: 'Ana Clara Santos',
    medico: 'Dr. Ricardo Alves',
    horario: '10:30',
    convenio: 'Unimed',
    status: 'Confirmado',
    dataNascimento: '05/03/1985',
    sexo: 'Feminino',
    historico: 'Paciente com histórico de hipertensão. Última consulta em 01/2026.',
    laudo: '',
    receita: '',
  },
  {
    id: '3',
    paciente: 'Carlos Eduardo Lima',
    medico: 'Dr. Paulo Mota',
    horario: '11:00',
    convenio: 'Particular',
    status: 'Confirmado',
    dataNascimento: '14/11/1978',
    sexo: 'Masculino',
    historico: 'Sem consultas anteriores registradas.',
    laudo: '',
    receita: '',
  },
];

export default function RealizarConsulta() {
  const [consultas, setConsultas] = useState<Consulta[]>(consultasMock);
  const [consultaSelecionada, setConsultaSelecionada] = useState<Consulta | null>(null);
  const [laudo, setLaudo] = useState<string>('');
  const [receita, setReceita] = useState<string>('');

  function handleAbrirAtendimento(consulta: Consulta) {
    setConsultaSelecionada(consulta);
    setLaudo(consulta.laudo);
    setReceita(consulta.receita);
  }

  function handleFecharModal() {
    setConsultaSelecionada(null);
    setLaudo('');
    setReceita('');
  }

  function handleFinalizar() {
    if (!laudo.trim()) {
      Alert.alert('Atenção', 'Preencha o laudo antes de finalizar.');
      return;
    }

    setConsultas((prev) =>
      prev.filter((c) => c.id !== consultaSelecionada?.id)
    );

    Alert.alert(
      'Atendimento Finalizado',
      `Paciente ${consultaSelecionada?.paciente} atendido com sucesso.`,
    );

    handleFecharModal();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTexto}>Clínica Médica</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.titulo}>Atendimento Médico</Text>
        <Text style={styles.subtitulo}>
          {consultas.length} {consultas.length === 1 ? 'paciente aguardando' : 'pacientes aguardando'}
        </Text>

        {consultas.length === 0 && (
          <View style={styles.listaVaziaBox}>
            <Text style={styles.listaVaziaTexto}>Nenhum paciente aguardando atendimento.</Text>
          </View>
        )}

        {consultas.map((consulta) => (
          <View key={consulta.id} style={styles.card}>

            <View style={styles.cardHeader}>
              <Text style={styles.cardNome}>{consulta.paciente}</Text>
              <View style={styles.badgeConfirmado}>
                <Text style={styles.badgeTexto}>Confirmado</Text>
              </View>
            </View>

            <Text style={styles.cardInfo}>Médico: {consulta.medico}</Text>
            <Text style={styles.cardInfo}>Horário: {consulta.horario}</Text>
            <Text style={styles.cardInfo}>Convênio: {consulta.convenio}</Text>

            <TouchableOpacity style={styles.botaoAtender} onPress={() => handleAbrirAtendimento(consulta)}>
              <Text style={styles.botaoAtenderTexto}>Realizar Atendimento</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <Modal visible={consultaSelecionada !== null} animationType="slide" transparent={true} onRequestClose={handleFecharModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>
                Atendimento - {consultaSelecionada?.paciente}
              </Text>
              <TouchableOpacity onPress={handleFecharModal}>
                <Text style={styles.modalFechar}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScroll}>
              <View style={styles.secao}>
                <View style={styles.secaoHeader}>
                  <Text style={styles.secaoIcone}>👤</Text>
                  <Text style={styles.secaoTitulo}>Histórico do Paciente</Text>
                </View>
                <View style={styles.secaoConteudo}>
                  <Text style={styles.historicoDado}>
                    Data de Nascimento: {consultaSelecionada?.dataNascimento}
                  </Text>
                  <Text style={styles.historicoDado}>
                    Sexo: {consultaSelecionada?.sexo}
                  </Text>
                  <Text style={styles.historicoTexto}>
                    {consultaSelecionada?.historico}
                  </Text>
                </View>
              </View>
              <View style={styles.secao}>
                <View style={styles.secaoHeader}>
                  <Text style={styles.secaoIcone}></Text>
                  <Text style={styles.secaoTitulo}>Laudo / Observações</Text>
                </View>
                <TextInput style={styles.textArea} placeholder="Digite o laudo da consulta..." placeholderTextColor="#aaa" value={laudo} onChangeText={setLaudo} multiline numberOfLines={5} textAlignVertical="top"/>
              </View>
              <View style={styles.secao}>
                <Text style={styles.secaoTitulo}>Receita / Prescrição</Text>
                <TextInput style={[styles.textArea, styles.textAreaReceita]} placeholder="Digite a prescrição médica..." placeholderTextColor="#aaa" value={receita} onChangeText={setReceita} multiline numberOfLines={4} textAlignVertical="top"/>
              </View>
              <TouchableOpacity style={styles.botaoFinalizar} onPress={handleFinalizar}>
                <Text style={styles.botaoFinalizarTexto}>Finalizar Atendimento</Text>
              </TouchableOpacity>
            </ScrollView>

          </View>
        </View>
      </Modal>
    </View>
  );
}
