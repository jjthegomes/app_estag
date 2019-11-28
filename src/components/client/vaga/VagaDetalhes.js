import React, {Component} from 'react';
import {StatusBar, StyleSheet, Alert} from 'react-native';
import {
  Container,
  Spinner,
  Header,
  Body,
  Left,
  Right,
  Title,
  View,
  Content,
  List,
  ListItem,
  Text,
  Icon,
  Button,
} from 'native-base';
import {connect} from 'react-redux';
import {setUsuario} from '../../../actions/authGraphql';
import {COLORS} from '../../../utils/colors';
import apiGraphql from '../../../config/apiGraphql';
import api from '../../../config/api';

class VagaDetalhes extends Component {
  static navigationOptions = {
    title: 'Detalhes da Vaga',
  };

  constructor() {
    super();
    this.state = {
      loading: true,
      loadingCandidatura: false,
      vaga: null,
    };
  }

  async UNSAFE_componentWillMount() {
    const {id} = this.props.navigation.state.params;

    await this.getVaga(id);
    await this.submitHandler();
  }

  query = id => {
    return JSON.stringify({
      query: `
      query{
        vagaById(id:"${id}" ){
            empresa{
                nome
                email
                setor
                sobre      
              }
              _id
              nome
              descricao
              jornada
              requisitos    
              tipo
        }
      }
      `,
    });
  };

  getVaga = async id => {
    try {
      // console.time('Time Vaga Graphql');
      // const response = await apiGraphql.post('/graphql', this.query(id));
      // console.timeEnd('Time Vaga Graphql');
      // console.log('[size graphql]', response.headers['content-length']);

      // console.time('Time Vaga Rest');
      // const rest = await api.get('/vaga/' + id);
      // console.timeEnd('Time Vaga Rest');
      // console.log('[size rest]', rest.headers['content-length']);

      let tempoInicialGraphql = new Date().getTime();
      const response = await apiGraphql.post('/graphql', this.query(id));
      let tempoFinalGraphql = new Date().getTime();
      let timeG = tempoFinalGraphql - tempoInicialGraphql;
      let sizeG = response.headers['content-length'];

      let tempoInicialRest = new Date().getTime();
      const rest = await api.get('/vaga/' + id);
      let tempoFinalRest = new Date().getTime();
      let timeR = tempoFinalRest - tempoInicialRest;
      let sizeR = rest.headers['content-length'];

      const CSV = {
        csvFilename: './VagaByID.csv',

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

      this.setState({loading: false, vaga: response.data.data.vagaById});
      //this.props.navigation.navigate('Login');
    } catch (error) {
      console.log(error);
      console.timeEnd('Time Vaga Graphql');
      this.setState({loading: false});
      if (error.data.errors.length)
        Alert.alert('Atenção', error.data.errors[0].message);
    }
  };

  submitHandler = async () => {
    const {id} = this.props.navigation.state.params;

    if (this.state.loadingCandidatura == true) return;

    this.setState({loadingCandidatura: true});
    const requestBody = JSON.stringify({
      query: `
     mutation {
      candidatarVaga(
        vagaId:"${id}"), 
        {
          _id
          vaga{
            _id
          }
        }
      }
      `,
    });

    try {
      let tempoInicialGraphql = new Date().getTime();
      let response = await apiGraphql.post('/graphql', requestBody);
      let tempoFinalGraphql = new Date().getTime();
      let timeG = tempoFinalGraphql - tempoInicialGraphql;
      let sizeG = response.headers['content-length'];

      let tempoInicialRest = new Date().getTime();
      let rest = await api.post('/candidatura/', {vaga: id});
      let tempoFinalRest = new Date().getTime();
      let timeR = tempoFinalRest - tempoInicialRest;
      let sizeR = rest.headers['content-length'];

      const CSV = {
        csvFilename: './CandidatarVaga.csv',

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

      this.setState({loadingCandidatura: false});
      //this.props.navigation.navigate('Vagas');
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const {vaga} = this.state;
    return (
      <Container>
        <Header style={{backgroundColor: COLORS.THEME}}>
          <Left style={{flex: 1}}>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon
                type="MaterialIcons"
                name="arrow-back"
                style={{
                  color: COLORS.WHITE,
                  fontSize: 30,
                }}
              />
            </Button>
          </Left>
          <Body style={{flex: 2}}>
            <Title style={{color: COLORS.WHITE, fontSize: 24}}>
              Detalhes da Vaga
            </Title>
          </Body>
          <Right style={{flex: 1}} />
        </Header>
        <StatusBar backgroundColor={COLORS.THEME} barStyle="light-content" />

        <Content>
          {this.state.loading ? (
            <Spinner color={COLORS.THEME} size="large" />
          ) : vaga == null ? (
            <View />
          ) : (
            <List>
              <ListItem itemDivider>
                <Text>Empresa: {vaga.empresa.nome}</Text>
              </ListItem>
              <ListItem style={styles.listItem}>
                <Icon style={styles.icon} active name="ios-arrow-forward" />
                <Text style={styles.text}>Setor: {vaga.empresa.setor}</Text>
              </ListItem>
              <ListItem style={styles.listItem}>
                <Icon
                  style={[styles.icon, {fontSize: 24}]}
                  active
                  name="ios-mail"
                />
                <Text style={styles.text}>Contato: {vaga.empresa.email}</Text>
              </ListItem>
              <ListItem style={styles.listItem}>
                <Icon
                  style={[styles.icon, {fontSize: 24}]}
                  active
                  name="ios-information-circle-outline"
                />
                <Text style={styles.text}>Sobre: {vaga.empresa.sobre}</Text>
              </ListItem>
              <ListItem itemDivider>
                <Text style={styles.text}>Vaga: {vaga.nome}</Text>
              </ListItem>
              <ListItem style={styles.listItem}>
                <Icon style={styles.icon} active name="md-document" />
                <Text style={styles.text}>Descrição: {vaga.descricao}</Text>
              </ListItem>
              <ListItem style={styles.listItem}>
                <Icon style={styles.icon} active name="ios-pin" />
                <Text style={styles.text}>Modalidade: {vaga.tipo}</Text>
              </ListItem>
              <ListItem style={styles.listItem}>
                <Icon
                  style={[styles.icon, {fontSize: 24}]}
                  active
                  name="md-clock"
                />
                <Text style={styles.text}>Jornada: {vaga.jornada}h/semana</Text>
              </ListItem>
              <ListItem style={styles.listItem}>
                <Icon
                  style={[styles.icon, {fontSize: 20}]}
                  active
                  type="FontAwesome5"
                  name="tasks"
                />
                <Text style={styles.text}>Requisitos: {vaga.requisitos}</Text>
              </ListItem>

              <ListItem last style={styles.button}>
                <Button bordered danger>
                  <Text style={styles.buttonText}>Favoritar</Text>
                </Button>
                {this.state.loadingCandidatura ? (
                  <Spinner color={COLORS.THEME} size="small" />
                ) : (
                  <Button bordered success onPress={this.submitHandler()}>
                    <Text style={styles.buttonText}>Candidatar</Text>
                  </Button>
                )}
              </ListItem>
            </List>
          )}
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    color: COLORS.THEME,
    marginRight: 10,
  },
  listItem: {
    marginRight: 10,
  },
  text: {
    marginRight: 10,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
  },
});

const mapStateToProps = state => ({
  usuario: state.Auth.usuario,
});

export default connect(
  mapStateToProps,
  {setUsuario},
)(VagaDetalhes);
