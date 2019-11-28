import {createStackNavigator} from 'react-navigation';
import Vagas from './Vagas';
import VagaDetalhes from './VagaDetalhes';

export default createStackNavigator({
  Vagas: {
    screen: Vagas,
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
