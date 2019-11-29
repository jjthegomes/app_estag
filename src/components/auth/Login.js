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

import api from '../../config/api';

import {COLORS} from '../../utils/colors';
import {contar} from '../../actions/counter';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: 'jjthegomes@gmail.com',
      // email: 'empresa@gmail.com',
      senha: '123',
      loading: false,
    };
  }

  login = async () => {
    this.setState({loading: true});

    try {
      const response = await api.post('/auth/login', this.state);

      await this.storeToken(response.data.token);;
      this.setState({loading: false});
      if (response.data.empresa !== undefined) {
        this.props.setUsuario(this.parseUsuario(response.data.empresa));
        return this.props.navigation.navigate('Vaga');
      } else {
        this.props.setUsuario(this.parseUsuario(response.data.cliente));
        return this.props.navigation.navigate('Vagas');
      }
    } catch (error) {
      console.log(error);
      this.setState({loading: false});
      Alert.alert('Erro', error.data.error);
    }
  };

  parseUsuario = usuario => {
    console.log(usuario);
    if (usuario.tipo == 'cliente') {
      return {...usuario, ...usuario.usuario};
    } else {
      return {
        ...usuario.usuario.usuario,
        ...usuario.empresa,
        nomeEmpresa: usuario.nome,
        nome: usuario.usuario.nome,
        emailEmpresa: usuario.email,
        email: usuario.usuario.email,
      };
    }
  };

  storeToken = async token => {
    try {
      await AsyncStorage.setItem('@Estag:token', token);
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
              <TouchableOpacity style={styles.buttonStyle} onPress={this.login}>
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
