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
      email: Math.floor(Math.random() * 10000000 + Math.random()),
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

  postCSV = async (csvFilename = 'arquivo.csv', data = []) => {
    try {
      //   console.log({csvFilename, data});
      const response = await api.post('/csv', {csvFilename, data});
    } catch (error) {
      console.log(error);
    }
  };

  UNSAFE_componentWillMount = async () => {
    this.submitHandler();
  };

  submitHandler = async () => {
    if (this.state.contador === MAX) {
      return;
    }

    console.log(this.state.contador);

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
    this.setState({
      nome: 'EMPRESA_GRAPH' + this.state.contador,
      contador: this.state.contador + 1,
      loading: true,
      email: Math.floor(Math.random() * 10000000 + Math.random()),
    });
    let timeG = 0;
    let sizeG = 0;
    let timeR = 0;
    let sizeR = 0;

    const requestBody = {
      query: `
      mutation {
        criarUsuario(usuarioInput: {
            nome: "${this.state.nome}",
            email: "${this.state.email}",
            senha: "${this.state.senha}",
            tipo: "${this.state.tipo}",
        }){
          _id
          token   
        }
      }
      `,
    };

    try {
      let tempoInicialGraphql = new Date().getTime();
      let response = await apiGraphql.post(
        '/graphql',
        JSON.stringify(requestBody),
      );
      let tempoFinalGraphql = new Date().getTime();
      timeG = tempoFinalGraphql - tempoInicialGraphql;
      sizeG = response.headers['content-length'];

      this.setState({
        tokenG: response.data.data.criarUsuario.token,
      });
      await this.storeToken('@Estag:tokenG', this.state.tokenG);
      // await this.criarEmpresaGraphql();
    } catch (error) {
      console.log(error);
      this.setState({loading: false});
    }

    this.setState({
      nome: 'EMPRESA_REST' + this.state.contador,
      email: Math.floor(Math.random() * 10000000 + Math.random()),
    });

    try {
      let tempoInicialRest = new Date().getTime();
      let rest = await api.post('/auth/cadastro', {
        nome: this.state.nome,
        email: this.state.email,
        senha: this.state.senha,
        tipo: this.state.tipo,
      });
      let tempoFinalRest = new Date().getTime();
      timeR = tempoFinalRest - tempoInicialRest;
      sizeR = rest.headers['content-length'];

      this.setState({tokenR: rest.data.token});
      await this.storeToken('@Estag:tokenR', this.state.tokenR);
      // await this.criarEmpresaRest();
    } catch (error) {
      console.log(error);
      this.setState({loading: false});
    }

    await this.postCSV('CadastroUsuarioEmpresa.csv', [
      {
        timeR,
        sizeR,
        timeG,
        sizeG,
      },
    ]);
  };

  criarEmpresa = async () => {
    let timeG = 0;
    let sizeG = 0;
    let timeR = 0;
    let sizeR = 0;

    const requestBody = {
      query: `
       mutation {
          criarEmpresa(empresaInput: {
            nome: "${this.state.empresaNome}"
            cnpj:  "${this.state.cnpj}"
            telefone: "${this.state.telefone}"
            sobre:  "${this.state.sobre}"
            setor:  "${this.state.setor}"
            email:  "${this.state.empresaEmail}"
          }){
            _id
            }
        }
      `,
    };

    try {
      let tempoInicialGraphql = new Date().getTime();
      let response = await apiGraphql.post(
        '/graphql',
        JSON.stringify(requestBody),
      );
      let tempoFinalGraphql = new Date().getTime();
      timeG = tempoFinalGraphql - tempoInicialGraphql;
      sizeG = response.headers['content-length'];

      this.setState({loading: false});

      //return this.props.navigation.navigate('Login');
    } catch (error) {
      console.log(error);
      await this.deleterUsuario();
      this.setState({loading: false});
    }

    try {
      let tempoInicialRest = new Date().getTime();
      let rest = await api.post('/empresa', {
        nome: this.state.empresaNome,
        cnpj: this.state.cnpj,
        telefone: this.state.telefone,
        sobre: this.state.sobre,
        setor: this.state.setor,
        email: this.state.empresaEmail,
      });
      let tempoFinalRest = new Date().getTime();
      timeR = tempoFinalRest - tempoInicialRest;
      sizeR = rest.headers['content-length'];
    } catch (e) {
      console.log(e);
      await this.deleterUsuario();
      this.setState({loading: false});
    }

    await this.postCSV('CadastroEmpresa.csv', [
      {
        timeR,
        sizeR,
        timeG,
        sizeG,
      },
    ]);

    this.submitHandler();
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
