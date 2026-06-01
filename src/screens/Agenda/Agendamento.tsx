import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from './AgendamentoStyles';

import { db } from '../../config/Firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';

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

export default function Agendamento({ navigation }: any) {

  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [medico, setMedico] = useState<Medico | null>(null);
  const [tipoConsulta, setTipoConsulta] = useState<TipoConsulta | ''>('');
  const [slotSelecionado, setSlotSelecionado] = useState<string | null>(null);
  const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date());
  const [mostrarCalendario, setMostrarCalendario] = useState<boolean>(false);

  const [slots, setSlots] = useState<Slot[]>([
    { horario: '08:00', status: 'L' },
    { horario: '08:30', status: 'L' },
    { horario: '09:00', status: 'M' },
    { horario: '09:30', status: 'L' },
    { horario: '10:00', status: 'M' },
    { horario: '14:00', status: 'L' },
    { horario: '15:30', status: 'C' },
    { horario: '16:00', status: 'B' },
  ]);

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        
        const pacientesSnapshot = await getDocs(collection(db, 'Pacientes'));
        const listaPacientes = pacientesSnapshot.docs.map(d => ({
          id: d.id,
          nome: d.data().nome
        }));

        const medicosSnapshot = await getDocs(collection(db, 'Medicos'));
        const listaMedicos = medicosSnapshot.docs.map(d => ({
          id: d.id,
          nome: d.data().nome,
          especialidade: d.data().especialidade || d.data().esp || 'Geral'
        }));

        setPacientes(listaPacientes);
        setMedicos(listaMedicos);
      } catch (error) {
        console.error("Erro ao buscar dados do Firebase:", error);
        Alert.alert("Erro", "Falha ao sincronizar dados com o banco.");
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  useEffect(() => {
  if (!paciente) {
    setTipoConsulta('');
    return;
  }

  const pacienteAtual: Paciente = paciente;

  async function calcularTipoConsulta() {
    try {
      const q = query(
        collection(db, 'Consultas'),
        where('pacienteId', '==', pacienteAtual.id),
        orderBy('data', 'desc'),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setTipoConsulta('Primeira Consulta');
        return;
      }

      const ultimaConsulta = querySnapshot.docs[0].data();
      const dataUltima = ultimaConsulta.data?.seconds 
        ? new Date(ultimaConsulta.data.seconds * 1000) 
        : new Date(ultimaConsulta.data);

      const hoje = new Date();
      const diferencaEmMilissegundos = Math.abs(hoje.getTime() - dataUltima.getTime());
      const diferencaEmDias = Math.ceil(diferencaEmMilissegundos / (1000 * 60 * 60 * 24));

      if (diferencaEmDias <= 30) {
        setTipoConsulta('Retorno');
      } else {
        setTipoConsulta('Consulta Normal');
      }
    } catch (error) {
      console.error("Erro na regra de negócio:", error);
      setTipoConsulta('Consulta Normal');
    }
  }

  calcularTipoConsulta();
}, [paciente]);

  async function handleConfirmar() {
    if (!paciente || !medico || !slotSelecionado || !tipoConsulta) {
      Alert.alert('Atenção', 'Selecione paciente, médico, tipo de consulta e um horário disponível.');
      return;
    }

    try {
      setLoading(true);

      const dataFormatadaYMD = dataSelecionada.toISOString().split('T')[0];

      await addDoc(collection(db, 'Consultas'), {
        pacienteId: paciente.id,
        medicoId: medico.id,
        tipoConsulta,
        data: dataFormatadaYMD,
        hora: slotSelecionado,
        status: 'Agendada'
      });

      Alert.alert('Sucesso', 'Consulta salva no Firebase com sucesso!', [
        { text: 'OK', onPress: () => navigation && navigation.navigate('Confirmacao') }
      ]);
    } catch (error) {
      console.error("Erro ao salvar consulta:", error);
      Alert.alert("Erro", "Não foi possível gravar o agendamento.");
    } finally {
      setLoading(false);
    }
  }

  const handleCancelarSlot = (horario: string, slotId?: string) => {
    Alert.alert(
      "Operação de Cancelamento",
      "Deseja marcar essa agenda como cancelada?",
      [
        { text: "Paciente Desistiu", onPress: () => executarCancelamentoBanco(horario, slotId) },
        { text: "Paciente Ausente", onPress: () => executarCancelamentoBanco(horario, slotId) },
        { text: "Voltar", style: "cancel" }
      ]
    );
  };

  async function executarCancelamentoBanco(horario: string, slotId?: string) {
    try {
      if (slotId) {
        await updateDoc(doc(db, 'Consultas', slotId), {
          status: 'Cancelada'
        });
      }

      setSlots(prev => prev.map(s => 
        s.horario === horario ? { ...s, status: 'CANCELADA' } : s
      ));

      if (slotSelecionado === horario) setSlotSelecionado(null);
      Alert.alert("Sucesso", "Status atualizado para Cancelada com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível processar o cancelamento no Firestore.");
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

  if (loading && pacientes.length === 0) {
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
              {pacientes.map((p) => (
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
                setSlotSelecionado(null);
              }}
              style={styles.picker}
            >
              <Picker.Item label="Selecione o médico" value="" color="#aaa" />
              {medicos.map((m) => (
                <Picker.Item key={m.id} label={`${m.nome} — ${m.especialidade}`} value={m.id} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Tipo Consulta (Calculado de Forma Inteligente)</Text>
          <View style={[styles.pickerWrapper, { backgroundColor: '#e2e8f0' }]}>
            <Picker
              selectedValue={tipoConsulta}
              enabled={false}
              style={styles.picker}
            >
              <Picker.Item label="Aguardando a seleção do paciente..." value="" color="#718096" />
              <Picker.Item label="✨ Primeira Consulta" value="Primeira Consulta" />
              <Picker.Item label="🔄 Consulta Normal" value="Consulta Normal" />
              <Picker.Item label="📅 Retorno (Até 30 dias)" value="Retorno" />
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
              locale="pt-BR"
            />
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Horários Disponíveis</Text>
          <View style={styles.grade}>
            {slots
              .filter(s => s.status !== 'CANCELADA')
              .map((slot) => {
                const selecionado = slotSelecionado === slot.horario;
                const clicavel = podeSelecionar(slot.status);
                
                return (
                  <TouchableOpacity
                    key={slot.horario}
                    style={getSlotStyle(slot.status, selecionado)}
                    onPress={() => clicavel && setSlotSelecionado(slot.horario === slotSelecionado ? null : slot.horario)}
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
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.botaoConfirmar} onPress={handleConfirmar}>
        <Text style={styles.botaoConfirmarTexto}>Confirmar Agendamento</Text>
      </TouchableOpacity>
    </View>
  );
}