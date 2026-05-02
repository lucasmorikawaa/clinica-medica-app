import { StyleSheet, Platform } from "react-native";

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
    paddingBottom: 32,
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
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#22c55e',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
    flex: 1,
    marginRight: 8,
  },
  cardInfo: {
    fontSize: 13,
    color: '#555',
    marginBottom: 3,
  },
  badgeConfirmado: {
    backgroundColor: '#dcfce7',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  badgeTexto: {
    fontSize: 12,
    color: '#166534',
    fontWeight: '600',
  },
  botaoAtender: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  botaoAtenderTexto: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  listaVaziaBox: {
    alignItems: 'center',
    marginTop: 60,
  },
  listaVaziaTexto: {
    fontSize: 15,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '92%',
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
    flex: 1,
    marginRight: 8,
  },
  modalFechar: {
    fontSize: 18,
    color: '#666',
    padding: 4,
  },
  modalScroll: {
    padding: 16,
    paddingBottom: 24,
  },
  secao: {
    backgroundColor: '#f8f9fb',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#eef0f4',
  },
  secaoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  secaoIcone: {
    fontSize: 16,
    marginRight: 6,
  },
  secaoTitulo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
  },
  secaoConteudo: {
    gap: 4,
  },
  historicoDado: {
    fontSize: 13,
    color: '#444',
    marginBottom: 2,
  },
  historicoTexto: {
    fontSize: 13,
    color: '#666',
    marginTop: 6,
    fontStyle: 'italic',
  },
  textArea: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#222',
    minHeight: 110,
    marginTop: 10,
  },
  textAreaReceita: {
    minHeight: 90,
    backgroundColor: '#f8f9fb',
  },
  botaoFinalizar: {
    backgroundColor: '#16a34a',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  botaoFinalizarTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default styles;