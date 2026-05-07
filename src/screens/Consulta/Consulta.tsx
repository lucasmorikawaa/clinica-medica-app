import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  Platform 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from './ConsultaStyles';

// Tipagem conforme especificação
type SlotStatus = 'L' | 'M' | 'C' | 'X' | 'B' | 'CANCELADA';
type MotivoCancelamento = 'PACIENTE' | 'AUSENTE';

type Slot = {
  horario: string;
  status: SlotStatus;
  motivo?: MotivoCancelamento;
};

export default function AgendarConsulta() {
  const [pacienteSelecionado, setPacienteSelecionado] = useState<string>('');
  const [medicoSelecionado, setMedicoSelecionado] = useState<string>('');
  const [slotSelecionado, setSlotSelecionado] = useState<string | null>(null);
  const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date());
  const [mostrarCalendario, setMostrarCalendario] = useState<boolean>(false);

  // Estado dos slots para permitir a atualização dinâmica (Cancelamento)
  const [slots, setSlots] = useState<Slot[]>([
    { horario: '08:00', status: 'L' },
    { horario: '08:30', status: 'L' },
    { horario: '09:00', status: 'M' },
    { horario: '10:00', status: 'M' },
    { horario: '15:30', status: 'C' },
    { horario: '16:00', status: 'B' },
  ]);

  const formatarData = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  // Função de Cancelamento conforme especificação técnica
  const handleCancelarSlot = (horario: string) => {
    Alert.alert(
      "Cancelar Consulta",
      "Selecione o motivo do cancelamento:",
      [
        { text: "Paciente", onPress: () => confirmarCancelamento(horario, 'PACIENTE') },
        { text: "Ausente", onPress: () => confirmarCancelamento(horario, 'AUSENTE') },
        { text: "Voltar", style: "cancel" }
      ]
    );
  };

  const confirmarCancelamento = (horario: string, motivo: MotivoCancelamento) => {
    setSlots(prev => prev.map(s => 
      s.horario === horario ? { ...s, status: 'CANCELADA', motivo } : s
    ));
    if (slotSelecionado === horario) setSlotSelecionado(null);
    Alert.alert("Sucesso", `Status: CANCELADA | Motivo: ${motivo}`);
  };

  function handleConfirmar() {
    if (!pacienteSelecionado || !medicoSelecionado || !slotSelecionado) {
      Alert.alert('Atenção', 'Selecione paciente, médico e horário.');
      return;
    }
    Alert.alert('Sucesso', 'Consulta agendada com sucesso!');
  }

  // Helpers de Estilo usando o seu arquivo de Styles
  const getSlotContainerStyle = (status: SlotStatus, selecionado: boolean) => {
    if (selecionado) return [styles.slot, styles.slotSelecionado];
    if (status === 'L') return [styles.slot, styles.slotLivre];
    if (status === 'M') return [styles.slot, styles.slotMarcado];
    if (status === 'C') return [styles.slot, styles.slotCancelado];
    if (status === 'B') return [styles.slot, styles.slotBloqueado];
    return styles.slot;
  };

  const getSlotTextStyle = (status: SlotStatus, selecionado: boolean) => {
    if (selecionado) return styles.slotTextoSelecionado;
    if (status === 'L') return styles.slotTextoLivre;
    if (status === 'M') return styles.slotTextoMarcado;
    if (status === 'C') return styles.slotTextoCancelado;
    if (status === 'B') return styles.slotTextoBloqueado;
    return {};
  };

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
              <Picker.Item label="João Silva" value="1" />
              <Picker.Item label="Maria Souza" value="2" />
            </Picker>
          </View>

          <Text style={styles.label}>Data da Consulta</Text>
          <TouchableOpacity style={styles.dataBox} onPress={() => setMostrarCalendario(true)}>
            <Text style={styles.dataTexto}>{formatarData(dataSelecionada)}</Text>
            <Text style={styles.dataHint}>Alterar</Text>
          </TouchableOpacity>

          {mostrarCalendario && (
            <DateTimePicker
              value={dataSelecionada}
              mode="date"
              display="default"
              onChange={(e, d) => {
                setMostrarCalendario(false);
                if (d) setDataSelecionada(d);
              }}
            />
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Horários Disponíveis</Text>
          <View style={styles.grade}>
            {/* CRITÉRIO DE ACEITE: Não aparece mais nas listas ativas se estiver CANCELADA */}
            {slots
              .filter(s => s.status !== 'CANCELADA')
              .map((slot) => {
                const selecionado = slotSelecionado === slot.horario;
                return (
                  <TouchableOpacity
                    key={slot.horario}
                    style={getSlotContainerStyle(slot.status, selecionado)}
                    onPress={() => slot.status === 'L' && setSlotSelecionado(slot.horario)}
                    onLongPress={() => handleCancelarSlot(slot.horario)}
                  >
                    <Text style={[styles.slotHorario, getSlotTextStyle(slot.status, selecionado)]}>
                      {slot.horario}
                    </Text>
                    <Text style={[styles.slotLabel, getSlotTextStyle(slot.status, selecionado)]}>
                      {slot.status === 'L' ? 'Livre' : 'Ocupado'}
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