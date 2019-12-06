import {createStackNavigator} from 'react-navigation';
import Vaga from './Vaga';
import VagaDetalhes from './VagaDetalhes';
import AddVaga from './CriarVaga';

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
  AddVaga: {
    screen: AddVaga,
    navigationOptions: ({navigation}) => ({
      header: null,
    }),
  },
});
