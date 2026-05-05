import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Navbar from './src/components/Navbar/Navbar';
import { Header } from './src/components/Headers/Header';

export default function App() {
  return (
    <View style={styles.container}>
      <Header title="Clínica Médica" />
      <Navbar></Navbar>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
