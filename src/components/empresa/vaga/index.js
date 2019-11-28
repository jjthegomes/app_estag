import {createStackNavigator} from 'react-navigation';
import Vaga from './Vaga';
import VagaDetalhes from './VagaDetalhes';

export default createStackNavigator({
  Vaga: {
    screen: Vaga,
    navigationOptions: ({navigation}) => ({
      header: null,
    }),
  },
  VagaDetalhes: {
    screen: VagaDetalhes,
    navigationOptions: ({navigation}) => ({
      header: null,
    }),
  },
});
