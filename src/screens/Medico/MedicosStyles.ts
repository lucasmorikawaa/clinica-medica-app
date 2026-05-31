import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A202C',
  },
  subtitulo: {
    fontSize: 14,
    color: '#718096',
  },
  btnNovo: {
    backgroundColor: '#1A5CFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnNovoTexto: {
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 4,
  },
  list: {
    paddingBottom: 20,
  },
  medicoCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detalheText: {
    fontSize: 14,
    color: '#4A5568',
    marginLeft: 8,
  },
  badgeEspecialidade: {
    backgroundColor: '#EBF2FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
  },
  badgeText: {
    color: '#1A5CFF',
    fontSize: 12,
    fontWeight: '700',
  },
  btnExcluir: {
    padding: 8,
  },
  emptyText: {
    color: '#777',
    textAlign: 'center',
    paddingVertical: 24,
  },
});