import React from 'react';
import {createAppContainer, createStackNavigator} from 'react-navigation';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import {Transition} from 'react-native-reanimated';

import AuthStack from '../components/auth/';

import ClientStack from '../components/client/';
import EmpresaStack from '../components/empresa/';

export default createAppContainer(
  createAnimatedSwitchNavigator(
    {
      Auth: AuthStack,
      App: ClientStack,
      App2: EmpresaStack,
    },
    {
      // The previous screen will slide to the bottom while the next screen will fade in
      transition: (
        <Transition.Together>
          <Transition.Out
            type="slide-bottom"
            durationMs={400}
            interpolation="easeIn"
          />
          <Transition.In type="fade" durationMs={500} />
        </Transition.Together>
      ),
    },
  ),
);
