import React, {Component} from 'react';
import {StatusBar} from 'react-native';
import {
  Container,
  View,
  Content,
  Item,
  Input,
  Icon,
  Button,
  Text,
  Form,
  Spinner,
} from 'native-base';
import api from '../../config/api';
import apiGraphql from '../../config/apiGraphql';
import {COLORS} from '../../utils/colors';
import AsyncStorage from '@react-native-community/async-storage';

const MAX = 100;

export default class CadastroEmpresa extends Component {
  static navigationOptions = {
    title: 'Cadastro de Empresa',
  };

  constructor() {
    super();
    this.state = {
      nome: 'Jonas Gomes',
      email: 'jjthegomes@gmail.com',
      senha: '123',
      tipo: 'empresa',

      empresaNome: 'Estag Company',
      cnpj: '1234654867454',
      telefone: '3232-3425',
      sobre: 'Empresa de teste',
      setor: 'Tecnologia da Informção',
      empresaEmail: 'estag@gmail.com',

      loading: false,
      error: '',
      tokenG: null,
      tokenR: null,
      contador: 0,
    };
  }

  submitHandler = async () => {
    await this.criarUsuario();
    await this.criarEmpresa();
  };

  storeToken = async (key = '@Estag:token', token) => {
    try {
      await AsyncStorage.setItem(key, token);
    } catch (e) {
      console.log(e);
    }
  };

  criarUsuario = async () => {
    try {
      const response = await api.post('/auth/cadastro', {
        nome: this.state.nome,
        email: this.state.email,
        senha: this.state.senha,
        tipo: this.state.tipo,
      });

      await this.storeToken('@Estag:token', response.data.token);
    } catch (error) {
      console.log(error);
      this.setState({loading: false});
    }
  };

  criarEmpresa = async () => {
    try {
      const response = await api.post('/empresa', {
        nome: this.state.empresaNome,
        cnpj: this.state.cnpj,
        telefone: this.state.telefone,
        sobre: this.state.sobre,
        setor: this.state.setor,
        email: this.state.empresaEmail,
      });

      this.setState({loading: false});
      return this.props.navigation.navigate('Login');
    } catch (e) {
      console.log(e);
      await this.deleterUsuario();
      this.setState({loading: false});
    }
  };

  render() {
    return (
      <Container>
        <StatusBar backgroundColor={COLORS.THEME} barStyle="dark-content" />

        <Content padder>
          <Form>
            <Item>
              <Input
                placeholder="Nome do Responsável"
                keyboardType="default"
                value={this.state.nome}
                onChangeText={nome => this.setState({nome})}
              />
              <Icon active name="md-person" />
            </Item>
            <Item>
              <Input
                placeholder="Email"
                keyboardType="email-address"
                value={`${this.state.email}`}
                onChangeText={email => this.setState({email})}
              />
              <Icon active name="md-mail" />
            </Item>
            <Item last>
              <Input
                placeholder="Senha"
                keyboardType="default"
                value={this.state.senha}
                secureTextEntry
                onChangeText={senha => this.setState({senha})}
              />
              <Icon active name="md-lock" />
            </Item>
          </Form>

          <View
            style={{
              backgroundColor: '#F8F8F8',
              width: 630,
              height: 15,
            }}
          />

          <Form>
            <Item>
              <Input
                placeholder="Nome da Empresa"
                keyboardType="default"
                value={this.state.empresaNome}
                onChangeText={empresaNome => this.setState({empresaNome})}
              />
              <Icon active name="ios-business" />
            </Item>
            <Item>
              <Input
                placeholder="CNPJ"
                keyboardType="default"
                value={this.state.cnpj}
                onChangeText={cnpj => this.setState({cnpj})}
              />
              <Icon active name="md-business" />
            </Item>
            <Item>
              <Input
                placeholder="Telefone"
                keyboardType="phone-pad"
                value={this.state.telefone}
                onChangeText={telefone => this.setState({telefone})}
              />
              <Icon active name="ios-phone-portrait" />
            </Item>
            <Item last>
              <Input
                placeholder="Email de Contato"
                keyboardType="default"
                value={this.state.empresaEmail}
                onChangeText={empresaEmail => this.setState({empresaEmail})}
              />
              <Icon active type="MaterialCommunityIcons" name="contact-mail" />
            </Item>
            <View
              style={{
                backgroundColor: '#F8F8F8',
                width: 630,
                height: 15,
              }}
            />

            <Item>
              <Input
                placeholder="Breve descrição sobre a empresa"
                keyboardType="default"
                value={this.state.sobre}
                onChangeText={sobre => this.setState({sobre})}
              />
            </Item>
            <Item last>
              <Input
                placeholder="Setor de Atuação"
                keyboardType="default"
                value={this.state.setor}
                onChangeText={setor => this.setState({setor})}
              />
            </Item>
          </Form>
          <View
            style={{
              marginTop: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {this.state.loading ? (
              <Spinner color="#3C5A99" size="large" />
            ) : (
              <Button success onPress={() => this.submitHandler()}>
                <Text>Cadastrar</Text>
              </Button>
            )}
          </View>
        </Content>
      </Container>
    );
  }
}
