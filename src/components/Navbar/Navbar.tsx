import React from 'react';
import { View } from 'react-native';
import DrawerRoutes from '../../navigation/AppNavigator';
import { NavigationContainer } from '@react-navigation/native';

export default function Navbar(){
  return(
    <View style={{flex: 1}}> 
      <NavigationContainer>
        <DrawerRoutes />
      </NavigationContainer>
    </View>
    
  )
}