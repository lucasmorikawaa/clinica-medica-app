import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { styles } from "./AgendamentoStyles";

type SlotStatus = "L" | "M" | "C" | "X" | "B";

const STATUS_CONFIG: Record<SlotStatus, { label: string; container: any; text: any }> = {
  L: { label: "Livre", container: styles.slotLivre, text: styles.slotTextoLivre },
  M: { label: "Marcado", container: styles.slotMarcado, text: styles.slotTextoMarcado },
  C: { label: "Cancelado (P)", container: styles.slotCancelado, text: styles.slotTextoCancelado },
  X: { label: "Cancelado (M)", container: styles.slotCanceladoMedico, text: styles.slotTextoCanceladoMedico },
  B: { label: "Bloqueado", container: styles.slotBloqueado, text: styles.slotTextoBloqueado },
};


const pacientesMock = [{ id: "1", nome: "Enzo Aguiar" }, { id: "2", nome: "Lucas Keiji" }, { id: "3", nome: "Lucas Vieira" }];
const medicosMock = [{ id: "1", nome: "Dr. Ricardo", esp: "Geral" }, { id: "2", nome: "Dra. Ana", esp: "Cardio" }];
const slotsMock: { horario: string; status: SlotStatus }[] = [
  { horario: "08:00", status: "L" }, { horario: "09:00", status: "M" }, { horario: "10:00", status: "B" },
  { horario: "11:00", status: "L" }, { horario: "14:00", status: "C" }, { horario: "15:00", status: "L" },
];

export default function Agenda() {
  const [form, setForm] = useState({ paciente: "", medico: "", slot: "", data: new Date() });
  const [showCalendar, setShowCalendar] = useState(false);

  const handleConfirmar = () => {
    const { paciente, medico, slot } = form;
    if (!paciente || !medico || !slot) return Alert.alert("Erro", "Preencha todos os campos.");
    Alert.alert("Sucesso", "Agendamento realizado!");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.titulo}>Agendar Consulta</Text>
        <Text style={styles.subtitulo}>Selecione os detalhes abaixo</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Dados da Consulta</Text>
          
          
          {[ 
            { label: "Paciente", val: form.paciente, key: "paciente", data: pacientesMock },
            { label: "Médico", val: form.medico, key: "medico", data: medicosMock }
          ].map((field) => (
            <React.Fragment key={field.key}>
              <Text style={styles.label}>{field.label}</Text>
              <View style={styles.pickerWrapper}>
                <Picker 
                  selectedValue={field.val} 
                  onValueChange={(v) => setForm({ ...form, [field.key]: v })}
                >
                  <Picker.Item label={`Selecione o ${field.key}`} value="" color="#aaa" />
                  {field.data.map((item: any) => (
                    <Picker.Item key={item.id} label={item.nome} value={item.id} />
                  ))}
                </Picker>
              </View>
            </React.Fragment>
          ))}

          <Text style={styles.label}>Data</Text>
          <TouchableOpacity style={styles.dataBox} onPress={() => setShowCalendar(true)}>
            <Text style={styles.dataTexto}>{form.data.toLocaleDateString('pt-BR')}</Text>
          </TouchableOpacity>
          
          {showCalendar && (
            <DateTimePicker 
              value={form.data} 
              onChange={(_, d) => { setShowCalendar(false); if (d) setForm({ ...form, data: d }); }} 
            />
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Horários Disponíveis</Text>
          <View style={styles.grade}>
            {slotsMock.map((slot) => {
              const isSelected = form.slot === slot.horario;
              const config = STATUS_CONFIG[slot.status];
              const isClickable = ["L", "C"].includes(slot.status);

              return (
                <TouchableOpacity
                  key={slot.horario}
                  disabled={!isClickable}
                  onPress={() => setForm({ ...form, slot: slot.horario })}
                  style={[
                    styles.slot,
                    config.container,
                    isSelected && styles.slotSelecionado,
                    { width: "31%" }
                  ]}
                >
                  <Text style={[styles.slotHorario, isSelected ? styles.slotTextoSelecionado : config.text]}>
                    {slot.horario}
                  </Text>
                  <Text style={[styles.slotLabel, isSelected ? styles.slotTextoSelecionado : config.text]}>
                    {config.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.legendaTitulo}>Legenda:</Text>
          <View style={styles.legenda}>
            {(Object.keys(STATUS_CONFIG) as SlotStatus[]).map((key) => (
              <View key={key} style={[styles.legendaItem, STATUS_CONFIG[key].container]}>
                <Text style={[styles.legendaTexto, STATUS_CONFIG[key].text]}>
                  {key} - {STATUS_CONFIG[key].label}
                </Text>
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