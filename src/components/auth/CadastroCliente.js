import React, {Component} from 'react';
import {StyleSheet, Alert, View, StatusBar} from 'react-native';
import {
  Item,
  Input,
  Icon,
  Button,
  Text,
  Textarea,
  Form,
  Spinner,
  Label,
} from 'native-base';
import {ViewPager} from 'rn-viewpager';
import {format} from 'date-fns';
import StepIndicator from 'react-native-step-indicator';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../../config/api';
import apiGraphql from '../../config/apiGraphql';
import {COLORS} from '../../utils/colors';

const MAX = 100;

const PAGES = [0, 1, 2, 3];

const secondIndicatorStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 40,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#3C5A99',
  stepStrokeWidth: 3,
  separatorStrokeFinishedWidth: 4,
  stepStrokeFinishedColor: '#3C5A99',
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: '#3C5A99',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#3C5A99',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#3C5A99',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: '#3C5A99',
};

export default class CadastroCliente extends Component {
  static navigationOptions = {
    title: 'Cadastro',
  };

  constructor() {
    super();
    this.state = {
      currentPage: 0,
      nome: '',
      email: '',
      senha: '',
      tipo: 'cliente',
      genero: 'Outro',
      celular: '(32)9985-9717',
      dataNascimento: new Date().toISOString(),

      cep: '36031369',
      logradouro: 'Jacinto Furtado de Mendonça',
      bairro: 'São Geraldo',
      cidade: 'Juiz de Fora',
      numero: '131',
      uf: 'MG',
      complemento: '',

      formacaoAcademica: 'Bacharelado em Sistemas de Informação',
      formacaoProfissional: 'Curso Tecnico Informatica, Ingles Avançado',
      habilidades: 'Gerencia de projetos, Trabalho em equipe',
      experiencia: 'Desenvolvimento React, Node e Mongodb',

      lattes: Math.floor(Math.random() + 10),
      linkedin: Math.floor(Math.random() + 5),
      facebook: Math.floor(Math.random() + 7),

      loading: false,
      error: '',
      token: null,
    };
  }

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
        genero: this.state.genero,
        celular: this.state.celular,
        dataNascimento: this.state.dataNascimento,
      });
      await this.storeToken('@Estag:token', response.data.token);
    } catch (e) {
      console.log(e);
    }
  };

  criarCliente = async () => {
    try {
      const response = await api.post('/cliente', {
        telefone: '32342558',
        formacaoAcademica: this.state.formacaoAcademica,
        formacaoProfissional: this.state.formacaoProfissional,
        habilidades: this.state.habilidades,
        experiencia: this.state.experiencia,
        endereco: {
          cep: this.state.cep,
          logradouro: this.state.logradouro,
          cidade: this.state.cidade,
          bairro: this.state.bairro,
          uf: this.state.uf,
          complemento: this.state.complemento,
        },
        redeSocial: {
          facebook: this.state.facebook,
          linkedin: this.state.linkedin,
          lattes: this.state.lattes,
        },
      });

      console.log(response.data.cliente);
      return this.props.navigation.navigate('Login');
    } catch (e) {
      console.log(e);
      await this.deleterUsuario();
    }
  };

  submitHandler = async () => {
    await this.criarUsuario();
    await this.criarCliente();
  };

  deleterUsuario = async () => {
    return console.log('delete usuario');
  };

  componentWillReceiveProps(nextProps, nextState) {
    if (nextState.currentPage != this.state.currentPage) {
      if (this.viewPager) {
        this.viewPager.setPage(nextState.currentPage);
      }
    }
  }

  onStepPress = position => {
    this.setState({currentPage: position});
    this.viewPager.setPage(position);
  };

  renderViewPagerPage = data => {
    switch (data) {
      case 0:
        return this.renderUsuario();
      case 1:
        return this.renderEndereco();
      case 2:
        return this.renderAcademica();
      case 3:
        return this.renderSocial();
      default:
        return (
          <View key={data} style={styles.page}>
            <Text>{this.state.currentPage}</Text>
          </View>
        );
    }
  };

  avancarPagina = () => {
    if (this.state.currentPage == 0 || this.state.currentPage < 3) {
      this.setState({currentPage: this.state.currentPage + 1});
      //this.viewPager.setPage(this.state.currentPage + 1);
    } else {
      Alert.alert('Inscrição', 'Inscrição realizada com sucesso!');
      this.props.navigation.navigate('Login');
    }
  };

  voltarPagina = () => {
    if (this.state.currentPage <= 3 && this.state.currentPage >= 1) {
      this.setState({currentPage: this.state.currentPage - 1});
      // this.viewPager.setPage(this.state.currentPage - 1);
    } else {
      return false;
    }
  };

  renderUsuario = () => {
    return (
      <View>
        <Form>
          <Item>
            <Input
              autoCapitalize="words"
              placeholder="Nome"
              keyboardType="default"
              value={this.state.nome}
              onChangeText={nome => this.setState({nome})}
            />
            <Icon active name="md-person" />
          </Item>
          <Item>
            <Input
              autoCapitalize="none"
              placeholder="E-mail"
              keyboardType="email-address"
              value={this.state.email}
              onChangeText={email => this.setState({email})}
            />
            <Icon active name="md-mail" />
          </Item>
          <Item>
            <Input
              placeholder="Senha"
              keyboardType="default"
              value={this.state.senha}
              secureTextEntry
              onChangeText={senha => this.setState({senha})}
            />
            <Icon active name="md-lock" />
          </Item>

          <Item>
            <Input
              placeholder="Gênero"
              value={this.state.genero}
              onChangeText={genero => this.setState({genero})}
            />
            <Icon active name="ios-transgender" />
          </Item>

          <Item>
            <Input
              placeholder="Celular"
              keyboardType="phone-pad"
              value={this.state.celular}
              onChangeText={celular => this.setState({celular})}
            />
            <Icon active name="ios-phone-portrait" />
          </Item>
          <Item>
            <Input
              placeholder="Data Nascimento"
              keyboardType="number-pad"
              value={`${format(
                new Date(this.state.dataNascimento),
                'dd/MM/yyyy',
              )}`}
              onChangeText={dataNascimento => this.setState({dataNascimento})}
            />
            <Icon active name="md-calendar" />
          </Item>
        </Form>
      </View>
    );
  };

  renderEndereco = () => {
    return (
      <View>
        <Form>
          <Item>
            <Input
              placeholder="CEP"
              keyboardType="number-pad"
              value={this.state.cep}
              onChangeText={cep => this.setState({cep})}
            />
          </Item>
          <Item>
            <Input
              placeholder="Logradouro"
              keyboardType="default"
              value={this.state.logradouro}
              onChangeText={logradouro => this.setState({logradouro})}
            />
          </Item>
          <Item>
            <Input
              placeholder="Bairro"
              keyboardType="default"
              value={this.state.bairro}
              onChangeText={bairro => this.setState({bairro})}
            />
          </Item>
          <Item>
            <Input
              placeholder="Cidade"
              keyboardType="default"
              value={this.state.cidade}
              onChangeText={cidade => this.setState({cidade})}
            />
          </Item>
          <Item>
            <Input
              placeholder="Número"
              keyboardType="number-pad"
              value={this.state.numero}
              onChangeText={numero => this.setState({numero})}
            />
          </Item>
          <Item>
            <Input
              placeholder="UF"
              keyboardType="default"
              value={this.state.uf}
              onChangeText={uf => this.setState({uf})}
            />
          </Item>
          <Item>
            <Input
              placeholder="Complemento"
              keyboardType="default"
              value={this.state.complemento}
              onChangeText={complemento => this.setState({complemento})}
            />
          </Item>
        </Form>
      </View>
    );
  };

  renderAcademica = () => {
    return (
      <View>
        <Form>
          <Item stackedLabel>
            <Label>Formação Acadêmico</Label>
            <Textarea
              rowSpan={3}
              value={this.state.formacaoAcademica}
              onChangeText={formacaoAcademica =>
                this.setState({formacaoAcademica})
              }
            />
          </Item>
          <Item stackedLabel>
            <Label>Formação Profissional</Label>
            <Textarea
              rowSpan={3}
              value={this.state.formacaoProfissional}
              onChangeText={formacaoProfissional =>
                this.setState({formacaoProfissional})
              }
            />
          </Item>
          <Item stackedLabel>
            <Label>Habilidades</Label>
            <Textarea
              rowSpan={3}
              value={this.state.habilidades}
              onChangeText={habilidades => this.setState({habilidades})}
            />
          </Item>
          <Item stackedLabel>
            <Label>Experiencia</Label>
            <Textarea
              rowSpan={3}
              value={this.state.experiencia}
              onChangeText={experiencia => this.setState({experiencia})}
            />
          </Item>
        </Form>
      </View>
    );
  };

  renderSocial = () => {
    return (
      <View>
        <View>
          <Form>
            <Item>
              <Input
                placeholder="Lattes"
                keyboardType="default"
                value={this.state.lattes}
                onChangeText={lattes => this.setState({lattes})}
              />
              <Icon active name="ios-school" />
            </Item>
            <Item>
              <Input
                placeholder="Linkedin"
                keyboardType="default"
                value={this.state.linkedin}
                onChangeText={linkedin => this.setState({linkedin})}
              />
              <Icon active name="logo-linkedin" />
            </Item>
            <Item>
              <Input
                placeholder="Facebook"
                keyboardType="default"
                value={this.state.facebook}
                onChangeText={facebook => this.setState({facebook})}
              />
              <Icon active name="logo-facebook" />
            </Item>
          </Form>
        </View>

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
      </View>
    );
  };

  renderStepIndicator = params => {
    switch (params.position) {
      case 0: {
        return (
          <MaterialIcon
            name="person-add"
            style={{
              color: params.stepStatus === 'finished' ? '#ffffff' : '#3C5A99',
            }}
          />
        );
      }
      case 1: {
        return (
          <MaterialIcon
            name="location-on"
            style={{
              color: params.stepStatus === 'finished' ? '#ffffff' : '#3C5A99',
            }}
          />
        );
      }
      case 2: {
        return (
          <MaterialIcon
            type="MaterialIcons"
            name="school"
            style={{
              color: params.stepStatus === 'finished' ? '#ffffff' : '#3C5A99',
            }}
          />
        );
      }
      case 3: {
        return (
          <MaterialCommunityIcons
            name="facebook-box"
            style={{
              color: params.stepStatus === 'finished' ? '#ffffff' : '#3C5A99',
            }}
          />
        );
      }
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={COLORS.THEME} barStyle="dark-content" />

        <View style={styles.stepIndicator}>
          <StepIndicator
            stepCount={4}
            renderStepIndicator={this.renderStepIndicator}
            customStyles={secondIndicatorStyles}
            currentPosition={this.state.currentPage}
            onPress={this.onStepPress}
            labels={['Usuário', 'Endereço', 'Acadêmico', 'Social']}
          />
        </View>
        <ViewPager
          style={{flexGrow: 1}}
          ref={viewPager => {
            this.viewPager = viewPager;
          }}
          onPageSelected={page => this.setState({currentPage: page.position})}>
          {PAGES.map(page => this.renderViewPagerPage(page))}
        </ViewPager>
        {/* <View style={{flexDirection: 'row', padding: 20}}>
          {this.state.currentPage <= 4 && this.state.currentPage >= 1 && (
            <Left>
              <Button rounded onPress={() => this.voltarPagina()}>
                <Text>Voltar</Text>
              </Button>
            </Left>
          )}
          <Right>
            <Button rounded onPress={() => this.avancarPagina()}>
              {this.state.currentPage == 0 || this.state.currentPage < 4 ? (
                <Text>Avançar</Text>
              ) : (
                <Text>Finalizar</Text>
              )}
            </Button>
          </Right>
        </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  stepIndicator: {
    marginVertical: 10,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
    color: '#999999',
  },
  stepLabelSelected: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
    color: '#3C5A99',
  },
});
