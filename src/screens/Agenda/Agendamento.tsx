import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from './AgendamentoStyles';

type SlotStatus = 'L' | 'M' | 'C' | 'X' | 'B';

type Slot = {
  horario: string;
  status: SlotStatus;
};

type Paciente = {
  id: string;
  nome: string;
  telefone: string;
};

type Medico = {
  id: string;
  nome: string;
  especialidade: string;
};

const pacientesMock: Paciente[] = [
  { id: '1', nome: 'Enzo Aguiar', telefone: '(11) 98765-4321' },
  { id: '2', nome: 'Lucas Keiji', telefone: '(11) 91234-5678' },
  { id: '3', nome: 'Lucas Vieira', telefone: '(11) 99999-0000' },
  { id: '4', nome: 'Vitor Soler', telefone: '(11) 98888-1111' },
  { id: '5', nome: 'Fernanda Lima', telefone: '(11) 97777-2222' },
  { id: '6', nome: 'Roberto Alves', telefone: '(11) 96123-3333' },
  { id: '7', nome: 'Juliana Mendes', telefone: '(11) 95555-4444' },
  { id: '8', nome: 'Lucas Barbosa', telefone: '(11) 94444-5555' },
  { id: '9', nome: 'Beatriz Rocha', telefone: '(11) 93333-6666' }
];

const medicosMock: Medico[] = [
  { id: '1', nome: 'Dr. Ricardo Alves', especialidade: 'Clínico Geral' },
  { id: '2', nome: 'Dra. Ana Lima', especialidade: 'Cardiologia' },
  { id: '3', nome: 'Dr. Paulo Mota', especialidade: 'Ortopedia' },
];

const slotsMock: Slot[] = [
  { horario: '08:00', status: 'L' },
  { horario: '08:30', status: 'L' },
  { horario: '09:00', status: 'M' },
  { horario: '09:30', status: 'L' },
  { horario: '10:00', status: 'M' },
  { horario: '10:30', status: 'L' },
  { horario: '11:00', status: 'L' },
  { horario: '11:30', status: 'L' },
  { horario: '14:00', status: 'M' },
  { horario: '14:30', status: 'L' },
  { horario: '15:00', status: 'L' },
  { horario: '15:30', status: 'C' },
  { horario: '16:00', status: 'B' },
  { horario: '16:30', status: 'L' },
  { horario: '17:00', status: 'X' },
  { horario: '17:30', status: 'L' },
];

function formatarData(date: Date): string {
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
    case 'C': return 'Cancelado (Paciente)';
    case 'X': return 'Cancelado (Médico)';
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

export default function Agendamento() {
  const [pacienteSelecionado, setPacienteSelecionado] = useState<string>('');
  const [medicoSelecionado, setMedicoSelecionado] = useState<string>('');
  const [slotSelecionado, setSlotSelecionado] = useState<string | null>(null);
  const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date());
  const [mostrarCalendario, setMostrarCalendario] = useState<boolean>(false);

  function handleSelecionarSlot(slot: Slot) {
    if (!podeSelecionar(slot.status)) return;
    setSlotSelecionado(slot.horario === slotSelecionado ? null : slot.horario);
  }

  function handleDataChange(_event: any, selectedDate?: Date) {
    if (Platform.OS === 'android') setMostrarCalendario(false);
    if (selectedDate) setDataSelecionada(selectedDate);
  }

  function handleConfirmar() {
    if (!pacienteSelecionado || !medicoSelecionado || !slotSelecionado) {
      Alert.alert('Atenção', 'Selecione paciente, médico e um horário disponível.');
      return;
    }
    Alert.alert('Sucesso', 'Agendamento confirmado!');
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
              selectedValue={pacienteSelecionado}
              onValueChange={setPacienteSelecionado}
              style={styles.picker}
            >
              <Picker.Item label="Selecione o paciente" value="" color="#aaa" />
              {pacientesMock.map((p) => (
                <Picker.Item key={p.id} label={p.nome} value={p.id} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Médico / Especialidade</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={medicoSelecionado}
              onValueChange={(val) => {
                setMedicoSelecionado(val);
                setSlotSelecionado(null);
              }}
              style={styles.picker}
            >
              <Picker.Item label="Selecione o médico" value="" color="#aaa" />
              {medicosMock.map((m) => (
                <Picker.Item key={m.id} label={`${m.nome} — ${m.especialidade}`} value={m.id} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Data</Text>
          <TouchableOpacity
            style={styles.dataBox}
            onPress={() => setMostrarCalendario(true)}
          >
            <Text style={styles.dataTexto}>{formatarData(dataSelecionada)}</Text>
          </TouchableOpacity>

          {mostrarCalendario && (
            <View>
              <DateTimePicker
                value={dataSelecionada}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                minimumDate={new Date()}
                onChange={handleDataChange}
                locale="pt-BR"
              />
              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={styles.botaoFecharData}
                  onPress={() => setMostrarCalendario(false)}
                >
                  <Text style={styles.botaoFecharDataTexto}>Confirmar data</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Horários Disponíveis</Text>

          <View style={styles.grade}>
            {slotsMock.map((slot) => {
              const selecionado = slotSelecionado === slot.horario;
              const clicavel = podeSelecionar(slot.status);
              return (
                <TouchableOpacity
                  key={slot.horario}
                  style={getSlotStyle(slot.status, selecionado)}
                  onPress={() => handleSelecionarSlot(slot)}
                  activeOpacity={clicavel ? 0.7 : 1}
                  disabled={!clicavel}
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

          <Text style={styles.legendaTitulo}>Legenda:</Text>
          <View style={styles.legenda}>
            {[
              { status: 'L' as SlotStatus, style: styles.slotLivre, texto: styles.slotTextoLivre, label: 'L - Livre' },
              { status: 'M' as SlotStatus, style: styles.slotMarcado, texto: styles.slotTextoMarcado, label: 'M - Marcado' },
              { status: 'C' as SlotStatus, style: styles.slotCancelado, texto: styles.slotTextoCancelado, label: 'C - Cancelado (Paciente)' },
              { status: 'X' as SlotStatus, style: styles.slotCanceladoMedico, texto: styles.slotTextoCanceladoMedico, label: 'X - Cancelado (Médico)' },
              { status: 'B' as SlotStatus, style: styles.slotBloqueado, texto: styles.slotTextoBloqueado, label: 'B - Bloqueado' },
            ].map((item) => (
              <View key={item.status} style={[styles.legendaItem, item.style]}>
                <Text style={[styles.legendaTexto, item.texto]}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.botaoConfirmar} onPress={handleConfirmar}>
          <Text style={styles.botaoConfirmarTexto}>Confirmar Agendamento</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}