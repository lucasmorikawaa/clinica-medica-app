import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from './AgendamentoStyles';

import { db } from '../../config/Firebase';
import { collection, getDocs, addDoc, updateDoc, doc, query, where, orderBy, limit } from 'firebase/firestore';

type SlotStatus = 'L' | 'M' | 'C' | 'X' | 'B' | 'CANCELADA';
type TipoConsulta = 'Primeira Consulta' | 'Consulta Normal' | 'Retorno';

type Slot = {
  id?: string;
  horario: string;
  status: SlotStatus;
};

type Paciente = {
  id: string;
  nome: string;
};

type Medico = {
  id: string;
  nome: string;
  especialidade: string;
};

const HORARIOS_PADRAO = [
  '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00'
];

export default function Agendamento({ navigation }: any) {

  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [loadingDados, setLoadingDados] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [medico, setMedico] = useState<Medico | null>(null);
  const [tipoConsulta, setTipoConsulta] = useState<TipoConsulta | ''>('');
  const [slotSelecionado, setSlotSelecionado] = useState<string | null>(null);
  const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date());
  const [mostrarCalendario, setMostrarCalendario] = useState(false);

  const [slots, setSlots] = useState<Slot[]>(
    HORARIOS_PADRAO.map(h => ({ horario: h, status: 'L' }))
  );

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  async function carregarDados() {
    try {
      setLoadingDados(true);

      const pacientesSnapshot = await getDocs(collection(db, 'Pacientes'));
      const listaPacientes = pacientesSnapshot.docs.map(d => ({
        id: d.id,
        nome: d.data().nome
      }));

      const medicosSnapshot = await getDocs(collection(db, 'Medicos'));
      const listaMedicos = medicosSnapshot.docs.map(d => ({
        id: d.id,
        nome: d.data().nome,
        especialidade: d.data().especialidade || 'Geral'
      }));

      setPacientes(listaPacientes);
      setMedicos(listaMedicos);

      setPaciente(null);
      setMedico(null);
      setTipoConsulta('');
      setSlotSelecionado(null);
      setSlots(HORARIOS_PADRAO.map(h => ({ horario: h, status: 'L' })));

    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      Alert.alert('Erro', 'Falha ao sincronizar dados com o banco.');
    } finally {
      setLoadingDados(false);
    }
  }

  useEffect(() => {
    if (!medico) {
      setSlots(HORARIOS_PADRAO.map(h => ({ horario: h, status: 'L' })));
      setSlotSelecionado(null);
      return;
    }

    carregarSlots();
  }, [medico, dataSelecionada]);

  async function carregarSlots() {
    try {
      setLoadingSlots(true);

      const dataFormatada = dataSelecionada.toISOString().split('T')[0];

      const q = query(
        collection(db, 'Consultas'),
        where('medicoId', '==', medico!.id),
        where('data', '==', dataFormatada)
      );

      const snapshot = await getDocs(q);

      const mapaOcupados = new Map<string, SlotStatus>();

      snapshot.docs.forEach(d => {
        const dados = d.data();
        const hora: string = dados.hora;
        const status: string = dados.status;

        if (status === 'Cancelada') {
          mapaOcupados.set(hora, 'C');
        } else if (status === 'Agendada') {
          mapaOcupados.set(hora, 'M');
        }
      });

      const novosSlots: Slot[] = HORARIOS_PADRAO.map(horario => ({
        horario,
        status: mapaOcupados.get(horario) ?? 'L'
      }));

      setSlots(novosSlots);
      setSlotSelecionado(null);
    } catch (error) {
      console.error('Erro ao carregar slots:', error);
      setSlots(HORARIOS_PADRAO.map(h => ({ horario: h, status: 'L' })));
    } finally {
      setLoadingSlots(false);
    }
  }

  async function handleConfirmar() {
    if (!paciente || !medico || !slotSelecionado || !tipoConsulta) {
      Alert.alert('Atenção', 'Selecione paciente, médico, um horário disponível e o tipo de consulta.');
      return;
    }

    try {
      setSalvando(true);

      const dataFormatada = dataSelecionada.toISOString().split('T')[0];

      const qConflito = query(
        collection(db, 'Consultas'),
        where('medicoId', '==', medico.id),
        where('data', '==', dataFormatada),
        where('hora', '==', slotSelecionado),
        where('status', '==', 'Agendada')
      );

      const conflito = await getDocs(qConflito);

      if (!conflito.empty) {
        Alert.alert('Conflito', 'Este horário já está ocupado. Por favor, selecione outro.');
        setSalvando(false);
        return;
      }

      await addDoc(
        collection(db, 'Consultas'),
        {
          pacienteId: paciente.id,
          medicoId: medico.id,
          data: dataFormatada,
          hora: slotSelecionado,
          tipoConsulta: tipoConsulta,
          status: 'Agendada',
          laudo: '',
          receita: '',
        }
      );

      Alert.alert('Sucesso', 'Consulta agendada com sucesso!', [
        { text: 'OK', onPress: () => navigation.navigate('Confirmacao') }
      ]);

      await carregarSlots();
    } catch (error) {
      console.error('Erro ao salvar consulta:', error);
      Alert.alert('Erro', 'Não foi possível gravar o agendamento.');
    } finally {
      setSalvando(false);
    }
  }

  const handleCancelarSlot = (horario: string, slotId?: string) => {
    Alert.alert(
      'Cancelamento',
      'Selecione o motivo:',
      [
        { text: 'Paciente Desistiu', onPress: () => executarCancelamento(horario, slotId) },
        { text: 'Paciente Ausente', onPress: () => executarCancelamento(horario, slotId) },
        { text: 'Voltar', style: 'cancel' }
      ]
    );
  };

  async function executarCancelamento(horario: string, slotId?: string) {
    try {
      if (slotId) {
        await updateDoc(doc(db, 'Consultas', slotId), { status: 'Cancelada' });
      }

      setSlots(prev =>
        prev.map(s => s.horario === horario ? { ...s, status: 'CANCELADA' } : s)
      );

      if (slotSelecionado === horario) setSlotSelecionado(null);
      Alert.alert('Sucesso', 'Consulta cancelada com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cancelar no Firestore.');
    }
  }

  function formatarDataExibicao(date: Date): string {
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  function podeSelecionar(status: SlotStatus): boolean {
    return status === 'L' || status === 'C';
  }

  function getLabelStatus(status: SlotStatus): string {
    switch (status) {
      case 'L': return 'Livre';
      case 'M': return 'Marcado';
      case 'C': return 'Cancelado (P)';
      case 'X': return 'Cancelado (M)';
      case 'B': return 'Bloqueado';
      default: return status;
    }
  }

  function getSlotStyle(status: SlotStatus, selecionado: boolean) {
    if (selecionado) return [styles.slot, styles.slotSelecionado];
    switch (status) {
      case 'L': return [styles.slot, styles.slotLivre];
      case 'M': return [styles.slot, styles.slotMarcado];
      case 'C': return [styles.slot, styles.slotCancelado];
      case 'X': return [styles.slot, styles.slotCanceladoMedico];
      case 'B': return [styles.slot, styles.slotBloqueado];
      default: return [styles.slot];
    }
  }

  function getSlotTextStyle(status: SlotStatus, selecionado: boolean) {
    if (selecionado) return styles.slotTextoSelecionado;
    switch (status) {
      case 'L': return styles.slotTextoLivre;
      case 'M': return styles.slotTextoMarcado;
      case 'C': return styles.slotTextoCancelado;
      case 'X': return styles.slotTextoCanceladoMedico;
      case 'B': return styles.slotTextoBloqueado;
      default: return {};
    }
  }

  if (loadingDados) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={{ marginTop: 10, color: '#666' }}>Carregando dados da clínica...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.titulo}>Agendar Consulta</Text>
        <Text style={styles.subtitulo}>Selecione paciente, médico e horário</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Dados da Consulta</Text>

          <Text style={styles.label}>Paciente</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={paciente?.id || ''}
              onValueChange={(itemValue) => {
                const encontrado = pacientes.find(p => p.id === itemValue);
                setPaciente(encontrado || null);
              }}
              style={styles.picker}
            >
              <Picker.Item label="Selecione o paciente" value="" color="#aaa" />
              {pacientes.map(p => (
                <Picker.Item key={p.id} label={p.nome} value={p.id} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Médico / Especialidade</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={medico?.id || ''}
              onValueChange={(itemValue) => {
                const encontrado = medicos.find(m => m.id === itemValue);
                setMedico(encontrado || null);
              }}
              style={styles.picker}
            >
              <Picker.Item label="Selecione o médico" value="" color="#aaa" />
              {medicos.map(m => (
                <Picker.Item key={m.id} label={`${m.nome} — ${m.especialidade}`} value={m.id} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Tipo de Consulta</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={tipoConsulta}
              onValueChange={(itemValue) => setTipoConsulta(itemValue as TipoConsulta)}
              style={styles.picker}
            >
              <Picker.Item label="Selecione o tipo de consulta" value="" color="#aaa" />
              <Picker.Item label="Primeira Consulta" value="Primeira Consulta" />
              <Picker.Item label="Consulta Normal" value="Consulta Normal" />
              <Picker.Item label="Retorno" value="Retorno" />
            </Picker>
          </View>

          <Text style={styles.label}>Data da Consulta</Text>
          <TouchableOpacity style={styles.dataBox} onPress={() => setMostrarCalendario(true)}>
            <Text style={styles.dataTexto}>{formatarDataExibicao(dataSelecionada)}</Text>
          </TouchableOpacity>

          {mostrarCalendario && (
            <DateTimePicker
              value={dataSelecionada}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
              minimumDate={new Date()}
              onChange={(_, selectedDate) => {
                if (Platform.OS === 'android') setMostrarCalendario(false);
                if (selectedDate) setDataSelecionada(selectedDate);
              }}
            />
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Horários Disponíveis</Text>

          {loadingSlots ? (
            <ActivityIndicator size="small" color="#2563EB" style={{ marginVertical: 20 }} />
          ) : (
            <View style={styles.grade}>
              {slots
                .filter(s => s.status !== 'CANCELADA')
                .map(slot => {
                  const selecionado = slotSelecionado === slot.horario;
                  const clicavel = podeSelecionar(slot.status);

                  return (
                    <TouchableOpacity
                      key={slot.horario}
                      style={getSlotStyle(slot.status, selecionado)}
                      onPress={() =>
                        clicavel &&
                        setSlotSelecionado(
                          slot.horario === slotSelecionado ? null : slot.horario
                        )
                      }
                      onLongPress={() => handleCancelarSlot(slot.horario, slot.id)}
                      activeOpacity={clicavel ? 0.7 : 1}
                    >
                      <Text style={[styles.slotHorario, getSlotTextStyle(slot.status, selecionado)]}>
                        {slot.horario}
                      </Text>
                      <Text style={[styles.slotLabel, getSlotTextStyle(slot.status, selecionado)]}>
                        {getLabelStatus(slot.status)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.botaoConfirmar, salvando && { opacity: 0.6 }]}
        onPress={handleConfirmar}
        disabled={salvando}
      >
        <Text style={styles.botaoConfirmarTexto}>
          {salvando ? 'Salvando...' : 'Confirmar Agendamento'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}