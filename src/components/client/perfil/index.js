import {createStackNavigator} from 'react-navigation';
import Perfil from './Perfil';
import EditarPerfil from './EditarPerfil';

export default createStackNavigator({
  Perfil: {
    screen: Perfil,
    navigationOptions: ({navigation}) => ({
      header: null,
    }),
  },
  EditarPerfil: {
    screen: EditarPerfil,
    navigationOptions: ({navigation}) => ({
      header: null,
    }),
  },
});
