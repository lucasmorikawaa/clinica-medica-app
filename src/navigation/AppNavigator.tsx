import { createDrawerNavigator } from '@react-navigation/drawer';
import Agenda  from '../screens/Agenda';
import Atendimento from '../screens/Atendimento';
import DashBoard from '../screens/DashBoard';
import Paciente from '../screens/Paciente';

const Drawer = createDrawerNavigator();

export default function DrawerRoutes(){

    return(
        <Drawer.Navigator>
            <Drawer.Screen 
                name="Agenda"
                component={Agenda}
            />

            <Drawer.Screen
                name="Atendimento"
                component={Atendimento}
            />

            <Drawer.Screen
                name="DashBoard"
                component={DashBoard}
            />

            <Drawer.Screen
                name="Paciente"
                component={Paciente}
            />
        </Drawer.Navigator>
    )

}