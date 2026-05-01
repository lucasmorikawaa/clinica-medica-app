import { StyleSheet } from "react-native";
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },

  header: {
    backgroundColor: '#2563EB',
    paddingTop: Platform.OS === 'ios' ? 50 : 36,
    paddingBottom: 14,
    paddingHorizontal: 16,
  },
  headerTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  scroll: {
    padding: 16,
    paddingBottom: 100,
  },

  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 2,
  },
  subtitulo: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
  },
  cardTitulo: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    marginBottom: 12,
  },

  label: {
    fontSize: 13,
    color: '#444',
    marginBottom: 4,
    marginTop: 10,
  },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#dde3ee',
    borderRadius: 8,
    backgroundColor: '#f8f9fb',
    overflow: 'hidden',
  },
  picker: {
    height: 48,
    color: '#333',
  },

  dataBox: {
    borderWidth: 1,
    borderColor: '#2563EB',
    borderRadius: 8,
    backgroundColor: '#eff6ff',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dataTexto: {
    fontSize: 15,
    color: '#1e40af',
    fontWeight: '600',
  },
  dataHint: {
    fontSize: 12,
    color: '#60a5fa',
  },

  botaoFecharData: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  botaoFecharDataTexto: {
    color: '#fff',
    fontWeight: '600',
  },

  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  slot: {
    width: '31%',
    borderRadius: 8,
    borderWidth: 1.5,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  slotHorario: {
    fontSize: 15,
    fontWeight: '600',
  },
  slotLabel: {
    fontSize: 11,
    marginTop: 2,
  },

  slotLivre: {
    backgroundColor: '#dcfce7',
    borderColor: '#86efac',
  },
  slotTextoLivre: {
    color: '#166534',
  },

  slotMarcado: {
    backgroundColor: '#dbeafe',
    borderColor: '#93c5fd',
  },
  slotTextoMarcado: {
    color: '#1e40af',
  },

  slotCancelado: {
    backgroundColor: '#fee2e2',
    borderColor: '#fca5a5',
  },
  slotTextoCancelado: {
    color: '#991b1b',
  },

  slotCanceladoMedico: {
    backgroundColor: '#fef3c7',
    borderColor: '#fcd34d',
  },
  slotTextoCanceladoMedico: {
    color: '#92400e',
  },

  slotBloqueado: {
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
  },
  slotTextoBloqueado: {
    color: '#6b7280',
  },

  slotSelecionado: {
    backgroundColor: '#1d4ed8',
    borderColor: '#1d4ed8',
  },
  slotTextoSelecionado: {
    color: '#fff',
  },

  legenda: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 14,
  },
  legendaItem: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  legendaTexto: {
    fontSize: 11,
    fontWeight: '500',
  },

  botaoConfirmar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2563EB',
    paddingVertical: 18,
    alignItems: 'center',
  },
  botaoConfirmarTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default styles;