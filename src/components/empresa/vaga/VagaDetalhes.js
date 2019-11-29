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
      token: '',
    };
  }

  async UNSAFE_componentWillMount() {
    const {id} = this.props.navigation.state.params;
    await this.getVaga(id);
  }

  getVaga = async id => {
    try {
      const response = await api.get('/vaga/' + id);
      console.log(response.data);

      this.setState({loading: false, vaga: response.data});
    } catch (error) {
      console.log(error);
      this.setState({loading: false});
      if (error.data.error) {
        Alert.alert('Atenção', error.data.error);
      }
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
                  color: '#fff',
                  fontSize: 30,
                }}
              />
            </Button>
          </Left>
          <Body style={{flex: 2}}>
            <Title style={{color: '#fff', fontSize: 24}}>
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
                <Icon style={styles.icon} active name="ios-mail" />
                <Text style={styles.text}>Contato: {vaga.empresa.email}</Text>
              </ListItem>
              <ListItem style={styles.listItem}>
                <Icon
                  style={styles.icon}
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
                <Icon style={styles.icon} active name="md-clock" />
                <Text style={styles.text}>Jornada: {vaga.jornada}h/semana</Text>
              </ListItem>
              <ListItem style={styles.listItem}>
                <Icon
                  style={styles.icon}
                  active
                  type="FontAwesome5"
                  name="tasks"
                />
                <Text style={styles.text}>Requisitos: {vaga.requisitos}</Text>
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
