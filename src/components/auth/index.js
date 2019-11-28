import {createStackNavigator} from 'react-navigation';

import Login from './Login';
import CadastroCliente from './CadastroCliente';
import CadastroEmpresa from './CadastroEmpresa';

export default createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: ({navigation}) => ({
      header: null,
    }),
  },
  CadastroCliente: {
    screen: CadastroCliente,
  },
  CadastroEmpresa: {
    screen: CadastroEmpresa,
  },
});
