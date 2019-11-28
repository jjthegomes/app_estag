import React from 'react';

import {createBottomTabNavigator} from 'react-navigation';
import {Icon} from 'native-base';

import Perfil from './perfil';
import Vagas from './vaga';
import {COLORS} from '../../utils/colors';

export default createBottomTabNavigator({
  Vagas: {
    screen: Vagas,
    path: '/',
    navigationOptions: {
      tabBarOptions: {
        activeTintColor: COLORS.THEME,
        showLabel: true,
      },
      title: 'Vagas',
      tabBarIcon: ({focused}) => (
        <Icon
          type="MaterialCommunityIcons"
          name="briefcase-search"
          size={26}
          style={{color: COLORS.THEME}}
        />
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
