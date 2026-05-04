import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 
import Agenda from '../screens/Agenda/Agenda';
import Atendimento from '../screens/Atendimento/Atendimento';
import DashBoard from '../screens/DashBoard/DashBoard';
import Paciente from '../screens/Pacientes/Pacientes';

const Tab = createBottomTabNavigator();

const icons: Record<string, { active: any; inactive: any }> = {
  Agenda: { active: 'calendar', inactive: 'calendar-outline' },
  Atendimento: { active: 'medical', inactive: 'medical-outline' },
  DashBoard: { active: 'stats-chart', inactive: 'stats-chart-outline' },
  Paciente: { active: 'people', inactive: 'people-outline' },
};

export default function TabRoutes() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2f95dc',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ focused, color, size }) => {
          const iconConfig = icons[route.name];
          const iconName = focused ? iconConfig.active : iconConfig.inactive;

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Agenda" component={Agenda} />
      <Tab.Screen name="Atendimento" component={Atendimento} />
      <Tab.Screen name="DashBoard" component={DashBoard} />
      <Tab.Screen name="Paciente" component={Paciente} />
    </Tab.Navigator>
  );
}