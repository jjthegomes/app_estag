import React, {Component} from 'react';
import {
  StatusBar,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Spinner,
  Content,
  Left,
  Body,
  Right,
  Header,
  Title,
  View,
  Text,
  Icon,
  Card,
  CardItem,
  Container,
} from 'native-base';

import {connect} from 'react-redux';
import {setUsuario} from '../../../actions/authGraphql';
import {COLORS} from '../../../utils/colors';
import api from '../../../config/api';

export class Vagas extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      vagas: [],
    };
  }

  async UNSAFE_componentWillMount() {
    await this.getVagas();
  }

  getVagas = async () => {
    try {
      let rest = await api.get('/vaga/');

      this.setState({loading: false, vagas: rest.data.vagas});
    } catch (error) {
      console.log(error);
      this.setState({loading: false});
    }
  };

  renderVagas = () => {
    const {vagas} = this.state;

    if (vagas.length == 0) {
      return (
        <View
          style={{
            marginTop: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../../../assets/vagas.png')}
            style={styles.image}
          />
          <Text style={styles.nenhumaVaga}>Nenhuma vaga encontrada</Text>
        </View>
      );
    }

    return vagas.map((vaga, i) => {
      return (
        <View style={styles.container} key={i}>
          <Card transparent style={styles.card}>
            <CardItem header bordered>
              <TouchableOpacity
                style={styles.header}
                onPress={() =>
                  this.props.navigation.navigate('VagaDetalhes', {id: vaga._id})
                }>
                <Icon name={'md-search'} style={styles.iconHeader} />
                <Text style={styles.tituloVaga}>{vaga.nome}</Text>
              </TouchableOpacity>
            </CardItem>
            <CardItem bordered>
              <Body style={styles.body}>
                <View style={styles.iconView}>
                  <Icon name={'md-pin'} style={styles.iconBody} />
                  <Text>
                    {vaga.local}/{vaga.tipo}
                  </Text>
                </View>
                <View style={styles.iconView}>
                  <Icon name={'md-clock'} style={styles.iconBody} />
                  <Text>{vaga.jornada}h/semana</Text>
                </View>
              </Body>
            </CardItem>
            <CardItem style={styles.footer} footer>
              {/* <Icon
                type="FontAwesome5"
                name={'tasks'}
                style={styles.iconBody}
              /> */}

              <Text style={{marginLeft: -10, marginRight: 5}}>
                Requisitos: {vaga.requisitos}
              </Text>
            </CardItem>
          </Card>
        </View>
      );
    });
  };

  render() {
    return (
      <Container>
        <Header style={{backgroundColor: COLORS.THEME}}>
          <Left style={{flex: 1}} />
          <Body style={{flex: 2}}>
            <Title style={{color: '#fff', fontSize: 24}}>Vagas</Title>
          </Body>
          <Right style={{flex: 1}} />
        </Header>
        <Content padder>
          {this.state.loading ? (
            <View>
              <Spinner color={COLORS.THEME} size={'large'} />
            </View>
          ) : (
            this.renderVagas()
          )}
          <StatusBar backgroundColor={COLORS.THEME} barStyle="light-content" />
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D5D5D5',
    marginBottom: 10,
  },
  image: {
    width: 300,
    height: 310,
  },
  card: {
    backgroundColor: 'transparent',
    padding: 5,
  },
  header: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: -10,
  },
  body: {
    flexWrap: 'wrap',
  },
  iconHeader: {
    color: COLORS.THEME,
    marginTop: -10,
  },
  tituloVaga: {
    color: COLORS.THEME,
    fontWeight: 'bold',
    marginTop: -10,
  },
  descricaoVaga: {
    fontSize: 14,
    color: COLORS.THEME,
  },
  iconView: {
    //justifyContent: 'center',
    //alignItems: 'center',
    marginBottom: 5,
    flexDirection: 'row',
  },

  iconBody: {
    color: COLORS.THEME,
    marginRight: 15,
    fontSize: 26,
  },
  footer: {
    flexWrap: 'wrap',
  },

  nenhumaVaga: {
    color: '#D8D8D8',
    marginTop: 5,
    fontSize: 18,
  },
});

const mapStateToProps = state => ({
  usuario: state.Auth.usuario,
});

export default connect(
  mapStateToProps,
  {setUsuario},
)(Vagas);
