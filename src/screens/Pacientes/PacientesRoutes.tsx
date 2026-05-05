import { createStackNavigator } from '@react-navigation/stack';
import Pacientes from './Pacientes';
import CadastrarPaciente from './CadastrarPaciente';

const Stack = createStackNavigator();

export default function PacientesRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ListaPacientes" component={Pacientes} />
      <Stack.Screen name="NovoPaciente" component={CadastrarPaciente} />
    </Stack.Navigator>
  );
}