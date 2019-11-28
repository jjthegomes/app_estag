import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import {Spinner} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';

import {width, height} from '../../utils';
import {setUsuario} from '../../actions/authGraphql';
import {queryLoginCliente, queryLoginEmpresa} from './requests';

import apiGraphql from '../../config/apiGraphql';
import api from '../../config/api';

import {COLORS} from '../../utils/colors';
import {contar} from '../../actions/counter';

const MAX = 5;

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: 'jjthegomes@gmail.com',
      // email: 'empresa@gmail.com',
      senha: '12345',
      loading: false,
    };
  }

  UNSAFE_componentWillMount() {
    //this.submitHandler();
  }

  submitHandler = () => {
    if (this.state.email.toLowerCase() !== 'jjthegomes@gmail.com') {
      return this.login(queryLoginEmpresa(this.state), 'Vaga');
    }
    return this.login(queryLoginCliente(this.state), 'Vagas');
  };

  login = async (query, screen = 'Vagas') => {
    if (this.props.contador >= MAX) {
      console.log('Done!');

      return Alert.alert('EXPERIMENTO', 'Encerrado');
    }
    this.setState({loading: true});

    try {
      // console.time('Time Login Graphql');
      // let response = await apiGraphql.post('/graphql', query);
      // console.timeEnd('Time Login Graphql');
      // console.log('[size graphql]', response.headers['content-length']);

      // console.time('Time Login REST');
      // let rest = await api.post('/auth/login', this.state);
      // console.timeEnd('Time Login REST');
      // console.log('[size rest]', rest.headers['content-length']);

      let tempoInicialGraphql = new Date().getTime();
      let response = await apiGraphql.post('/graphql', query);
      let tempoFinalGraphql = new Date().getTime();
      let timeG = tempoFinalGraphql - tempoInicialGraphql;
      let sizeG = response.headers['content-length'];

      let tempoInicialRest = new Date().getTime();
      let rest = await api.post('/auth/login', this.state);
      let tempoFinalRest = new Date().getTime();
      let timeR = tempoFinalRest - tempoInicialRest;
      let sizeR = rest.headers['content-length'];

      const CSV = {
        csvFilename: './LoginCliente.csv',

        data: [
          {
            timeR,
            sizeR,
            timeG,
            sizeG,
          },
        ],
      };

      const r = await api.post('/csv', CSV);
      console.log(CSV);
      this.props.contar();
      this.setState({loading: false});

      if (response.status == 200) {
        this.storeData(response.data.data.login);
        this.props.navigation.navigate(screen);
      }
    } catch (error) {
      console.log(error);
      this.setState({loading: false});
      if (error.data.errors.length)
        Alert.alert('Atenção', error.data.errors[0].message);

      //return console.log(error.data);
    }
  };

  parseUsuario = usuario => {
    if (usuario.usuario.tipo == 'cliente')
      return {...usuario.cliente, ...usuario.usuario};
    else {
      return {
        ...usuario.usuario,
        ...usuario.empresa,
        nomeEmpresa: usuario.empresa.nome,
        nome: usuario.usuario.nome,
        emailEmpresa: usuario.empresa.email,
        email: usuario.usuario.email,
      };
    }
  };

  storeData = async usuario => {
    this.props.setUsuario(this.parseUsuario(usuario));

    const firstPair = [
      '@Estag:usuario',
      JSON.stringify(this.parseUsuario(usuario)),
    ];
    const secondPair = ['@Estag:tokenG', usuario.token];
    const thirdyPair = ['@Estag:tokenR', usuario.token];
    try {
      await AsyncStorage.multiSet([firstPair, secondPair, thirdyPair]);
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <ImageBackground
        source={require('../../assets/login.png')}
        style={styles.imageBackgroud}>
        <StatusBar backgroundColor={COLORS.THEME} barStyle="light-content" />

        <View style={styles.tituloSection}>
          <Text style={styles.titleStyle}>Estag</Text>
          <Image
            source={require('../../assets/icon.png')}
            style={{width: 100, height: 100}}
          />
        </View>
        <View style={styles.container}>
          <View style={styles.input}>
            <TextInput
              style={styles.textInput}
              placeholder="Email"
              keyboardType="email-address"
              value={this.state.email}
              onChangeText={email => this.setState({email})}
            />
          </View>
          <View style={styles.input}>
            <TextInput
              style={styles.textInput}
              placeholder="Senha"
              keyboardType="default"
              secureTextEntry
              value={this.state.senha}
              onChangeText={senha => this.setState({senha})}
            />
          </View>

          {this.state.loading ? (
            <Spinner color={COLORS.THEME} size="large" />
          ) : (
            <View>
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => this.submitHandler()}>
                <Text style={styles.textStyle}>Entrar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() =>
                  this.props.navigation.navigate('CadastroCliente')
                }>
                <Text style={styles.textStyle}>Cadastrar como Cliente</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() =>
                  this.props.navigation.navigate('CadastroEmpresa')
                }>
                <Text style={styles.textStyle}>Cadastrar como Empresa</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  imageBackgroud: {
    flex: 1,
    width: width,
    height: height,
  },

  tituloSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: width / 4,
  },

  logo: {
    width: 100,
    height: 100,
  },
  titulo: {
    color: '#FFF',
    fontSize: 22,
  },

  container: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  input: {
    backgroundColor: '#F5F5F5',
    width: width - 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  textInput: {
    fontSize: 20,
    marginTop: Platform.OS === 'ios' ? 10 : 5,
    textAlign: 'center',
  },

  buttonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width - 50,
    marginTop: 10,
    padding: 10,
    borderRadius: 25,
    backgroundColor: COLORS.THEME,
  },
  titleStyle: {
    fontSize: 20,
    color: '#ffffff',
    width: width / 1.7,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  textStyle: {
    color: '#ffffff',
    width: width / 1.7,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

const mapStateToProps = state => ({
  usuario: state.Auth.usuario,
  contador: state.Counter.contador,
});

export default connect(
  mapStateToProps,
  {setUsuario, contar},
)(Login);
