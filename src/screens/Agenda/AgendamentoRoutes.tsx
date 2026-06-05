import { createStackNavigator } from '@react-navigation/stack';
import Agendamento from './Agendamento';
import Confirmacao from '../Confirmacao/Confirmacao';

const Stack = createStackNavigator();

export default function AgendamentoRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Agendamento" component={Agendamento} />
      <Stack.Screen name="Confirmacao" component={Confirmacao} />
    </Stack.Navigator>
  );
}