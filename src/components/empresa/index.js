import React from 'react';

import {createBottomTabNavigator} from 'react-navigation';
import {Icon} from 'native-base';

import Perfil from './perfil';
import Vaga from './vaga/';
import {COLORS} from '../../utils/colors';

export default createBottomTabNavigator({
  Vaga: {
    screen: Vaga,
    path: '/',
    navigationOptions: {
      tabBarOptions: {
        activeTintColor: COLORS.THEME,
        showLabel: true,
      },
      title: 'Vaga',
      tabBarIcon: ({focused}) => (
        <Icon name={'ios-briefcase'} size={26} style={{color: COLORS.THEME}} />
      ),
    },
  },

  Perfil: {
    screen: Perfil,
    path: '/',
    navigationOptions: {
      tabBarOptions: {
        activeTintColor: COLORS.THEME,
        showLabel: true,
      },
      title: 'Perfil',
      tabBarIcon: ({focused}) => (
        <Icon name={'ios-person'} size={26} style={{color: COLORS.THEME}} />
      ),
    },
  },
});
