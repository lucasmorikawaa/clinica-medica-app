import { createStackNavigator } from '@react-navigation/stack';
import Medicos from './Medicos';
import CadastrarMedico from './CadastrarMedico';

const Stack = createStackNavigator();

export default function MedicosRoutes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ListaMedicos" component={Medicos} />
      <Stack.Screen name="NovoMedico" component={CadastrarMedico} />
    </Stack.Navigator>
  );
}