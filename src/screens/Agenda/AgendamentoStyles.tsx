import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 20,
  },
  cardTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  dataBox: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    padding: 14,
  },
  dataTexto: {
    fontSize: 16,
    color: '#111827',
  },
  botaoFecharData: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  botaoFecharDataTexto: {
    color: '#2563EB',
    fontWeight: 'bold',
  },
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  slot: {
    width: '48%',
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  slotSelecionado: {
    borderWidth: 2,
    borderColor: '#000',
  },
  slotTextoSelecionado: {
    color: '#000',
    fontWeight: 'bold',
  },
  slotHorario: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  slotLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  slotLivre: {
    backgroundColor: '#D1FAE5',
    borderColor: '#A7F3D0',
  },
  slotTextoLivre: {
    color: '#065F46',
  },
  slotMarcado: {
    backgroundColor: '#DBEAFE',
    borderColor: '#BFDBFE',
  },
  slotTextoMarcado: {
    color: '#1E40AF',
  },
  slotCancelado: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
  },
  slotTextoCancelado: {
    color: '#991B1B',
  },
  slotCanceladoMedico: {
    backgroundColor: '#FFEDD5',
    borderColor: '#FED7AA',
  },
  slotTextoCanceladoMedico: {
    color: '#9A3412',
  },
  slotBloqueado: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  slotTextoBloqueado: {
    color: '#4B5563',
  },
  legendaTitulo: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  legenda: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  legendaItem: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  legendaTexto: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  botaoConfirmar: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  botaoConfirmarTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});