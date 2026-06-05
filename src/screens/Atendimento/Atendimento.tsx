import React, { useState, useCallback } from 'react';
import {View, Text, ScrollView, TouchableOpacity,TextInput, Modal, Alert, ActivityIndicator} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import styles from './AtendimentoStyles';

import { db } from '../../config/Firebase';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';

type Consulta = {
  id: string;
  paciente: string;
  pacienteId: string;
  medico: string;
  medicoId: string;
  horario: string;
  convenio: string;
  tipoConsulta: string;
  status: string;
  data: string;
  laudo: string;
  receita: string;
};

export default function RealizarConsulta() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [consultaSelecionada, setConsultaSelecionada] = useState<Consulta | null>(null);
  const [laudo, setLaudo] = useState('');
  const [receita, setReceita] = useState('');
  const [salvando, setSalvando] = useState(false);

  useFocusEffect(
    useCallback(() => {
      carregarConsultas();
    }, [])
  );

  async function carregarConsultas() {
    try {
      setLoading(true);

      const pacientesSnap = await getDocs(collection(db, 'Pacientes'));
      const medicosSnap = await getDocs(collection(db, 'Medicos'));

      const mapaPacientes: Record<string, any> = {};
      pacientesSnap.docs.forEach(d => { mapaPacientes[d.id] = d.data(); });

      const mapaMedicos: Record<string, any> = {};
      medicosSnap.docs.forEach(d => { mapaMedicos[d.id] = d.data(); });

      const q = query(
        collection(db, 'Consultas'),
        where('status', '==', 'Agendada')
      );
      const consultasSnap = await getDocs(q);

      const lista: Consulta[] = consultasSnap.docs.map(d => {
        const dados = d.data();
        const pacienteData = mapaPacientes[dados.pacienteId] || {};
        const medicoData = mapaMedicos[dados.medicoId] || {};

        return {
          id: d.id,
          pacienteId: dados.pacienteId,
          paciente: pacienteData.nome || 'Paciente não encontrado',
          medicoId: dados.medicoId,
          medico: medicoData.nome || 'Médico não encontrado',
          horario: dados.hora || '',
          convenio: pacienteData.convenio || 'Particular',
          tipoConsulta: dados.tipoConsulta || '',
          status: dados.status || '',
          data: dados.data || '',
          laudo: dados.laudo || '',
          receita: dados.receita || '',
        };
      });

      lista.sort((a, b) => a.horario.localeCompare(b.horario));
      setConsultas(lista);

    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as consultas.');
    } finally {
      setLoading(false);
    }
  }

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

  async function handleFinalizar() {
    if (!laudo.trim()) {
      Alert.alert('Atenção', 'Preencha o laudo antes de finalizar.');
      return;
    }

    try {
      setSalvando(true);

      await updateDoc(doc(db, 'Consultas', consultaSelecionada!.id), {
        laudo,
        receita,
        status: 'Realizada',
      });

      setConsultas(prev => prev.filter(c => c.id !== consultaSelecionada?.id));

      Alert.alert(
        'Atendimento Finalizado',
        `Paciente ${consultaSelecionada?.paciente} atendido com sucesso.`
      );

      handleFecharModal();
    } catch (error) {
      console.error('Erro ao finalizar atendimento:', error);
      Alert.alert('Erro', 'Não foi possível salvar o atendimento.');
    } finally {
      setSalvando(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={{ marginTop: 10, color: '#666' }}>Carregando consultas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
                <Text style={styles.badgeTexto}>{consulta.tipoConsulta || 'Agendada'}</Text>
              </View>
            </View>

            <Text style={styles.cardInfo}>Médico: {consulta.medico}</Text>
            <Text style={styles.cardInfo}>Horário: {consulta.horario}</Text>
            <Text style={styles.cardInfo}>Convênio: {consulta.convenio}</Text>
            <Text style={styles.cardInfo}>Data: {consulta.data}</Text>

            <TouchableOpacity
              style={styles.botaoAtender}
              onPress={() => handleAbrirAtendimento(consulta)}
            >
              <Text style={styles.botaoAtenderTexto}>Realizar Atendimento</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={consultaSelecionada !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={handleFecharModal}
      >
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
                  <Text style={styles.secaoTitulo}>Dados da Consulta</Text>
                </View>
                <View style={styles.secaoConteudo}>
                  <Text style={styles.historicoDado}>Tipo: {consultaSelecionada?.tipoConsulta}</Text>
                  <Text style={styles.historicoDado}>Data: {consultaSelecionada?.data}</Text>
                  <Text style={styles.historicoDado}>Horário: {consultaSelecionada?.horario}</Text>
                  <Text style={styles.historicoDado}>Convênio: {consultaSelecionada?.convenio}</Text>
                </View>
              </View>

              <View style={styles.secao}>
                <View style={styles.secaoHeader}>
                  <Text style={styles.secaoIcone}>📋</Text>
                  <Text style={styles.secaoTitulo}>Laudo / Observações</Text>
                </View>
                <TextInput
                  style={styles.textArea}
                  placeholder="Digite o laudo da consulta..."
                  placeholderTextColor="#aaa"
                  value={laudo}
                  onChangeText={setLaudo}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.secao}>
                <View style={styles.secaoHeader}>
                  <Text style={styles.secaoIcone}>💊</Text>
                  <Text style={styles.secaoTitulo}>Receita / Prescrição</Text>
                </View>
                <TextInput
                  style={[styles.textArea, styles.textAreaReceita]}
                  placeholder="Digite a prescrição médica..."
                  placeholderTextColor="#aaa"
                  value={receita}
                  onChangeText={setReceita}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity
                style={[styles.botaoFinalizar, salvando && { opacity: 0.6 }]}
                onPress={handleFinalizar}
                disabled={salvando}
              >
                <Text style={styles.botaoFinalizarTexto}>
                  {salvando ? 'Salvando...' : 'Finalizar Atendimento'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}