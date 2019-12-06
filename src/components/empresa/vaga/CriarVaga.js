import React, {Component} from 'react';
import {Alert, StatusBar} from 'react-native';
import {
  Container,
  Header,
  Right,
  Left,
  Body,
  Title,
  View,
  Content,
  Item,
  Input,
  Icon,
  Button,
  Text,
  Form,
  Spinner,
  Picker,
  Textarea,
  Label,
} from 'native-base';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {format} from 'date-fns';
import {COLORS} from '../../../utils/colors';

import api from '../../../config/api';

class Empresa extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      selectedDate: new Date(),
      nome: 'Desenvolvedor ',
      requisitos: 'Conhecimento em MongoDB, Spring, Java e Angular',
      tipo: 'emprego',
      modalidade: 'home office',
      jornada: 40,
      local: 'Juiz de Fora',
      escolaridade: 'Mestrando',
      descricao:
        'Desenvolver novas aplicações no ecosistema moderno com novas tecnologias',
    };
  }

  showDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: true});
  };

  hideDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: false});
  };

  handleDatePicked = async date => {
    if (new Date(date) < new Date()) {
      Alert.alert('Atenção', 'Informe uma data válida.');
    } else {
      this.setState({selectedDate: new Date(date)});
    }

    this.hideDateTimePicker();
  };

  submitHandler = async () => {
    this.setState({loading: true});

    let objeto = {
      nome: this.state.nome,
      requisitos: this.state.requisitos,
      tipo: this.state.tipo,
      jornada: this.state.jornada,
      modalidade: this.state.modalidade,
      local: this.state.local,
      escolaridade: this.state.escolaridade,
      descricao: this.state.descricao,
      dataFinal: new Date(
        format(this.state.selectedDate, 'yyyy-MM-dd'),
      ).toISOString(),
      dataInicio: new Date().toISOString(),
    };

    try {
      const response = await api.post('/vaga/', objeto);

      this.setState({loading: false});
      Alert.alert('Atenção', 'Vaga cadastrada!');
      return this.props.navigation.navigate('VagaDetalhes', {
        id: response.data._id,
      });
    } catch (error) {
      console.log(error);
      this.setState({loading: false});
    }
  };

  onValueChangeModalidade(value) {
    this.setState({modalidade: value});
  }

  onValueChangeTipo(value) {
    this.setState({tipo: value});
  }

  render() {
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
            <Title style={{color: '#fff', fontSize: 24}}>Cadastrar Vaga</Title>
          </Body>

          <Right style={{flex: 1}} />
        </Header>
        <StatusBar backgroundColor={COLORS.THEME} barStyle="light-content" />

        <Content padder>
          <Form>
            <Item stackedLabel>
              <Label>Nome</Label>
              <Icon active name="md-search" />
              <Input
                placeholder="Nome"
                keyboardType="default"
                value={this.state.nome}
                onChangeText={nome => this.setState({nome})}
              />
            </Item>
            <Item stackedLabel>
              <Label>Jornada</Label>
              <Icon active name="md-clock" />
              <Input
                placeholder="hh/semana"
                keyboardType="decimal-pad"
                value={`${this.state.jornada}`}
                onChangeText={jornada => this.setState({jornada})}
              />
            </Item>
            <Item stackedLabel>
              <Label>Local</Label>
              <Icon active name="ios-pin" />
              <Input
                placeholder="Local de Trabalho"
                keyboardType="default"
                value={this.state.local}
                onChangeText={local => this.setState({local})}
              />
            </Item>

            <Item stackedLabel>
              <Label>Escolaridade</Label>
              <Icon active name="md-school" />
              <Input
                placeholder="Escolaridade Minima"
                keyboardType="default"
                value={this.state.escolaridade}
                onChangeText={escolaridade => this.setState({escolaridade})}
              />
            </Item>

            <Item inlineLabel>
              <Label style={{width: 110}}>Modalidade</Label>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={{width: undefined}}
                placeholder="Selecione uma Modalidade"
                placeholderStyle={{color: '#bfc6ea'}}
                placeholderIconColor="#007aff"
                selectedValue={this.state.modalidade}
                onValueChange={this.onValueChangeModalidade.bind(this)}>
                <Picker.Item label="Presencial" value="presencial" />
                <Picker.Item label="Home Office" value="home office" />
              </Picker>
            </Item>

            <Item inlineLabel>
              <Label style={{width: 110}}>Tipo</Label>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={{width: undefined}}
                placeholder="Selecione um Tipo"
                placeholderStyle={{color: '#bfc6ea'}}
                placeholderIconColor="#007aff"
                selectedValue={this.state.tipo}
                onValueChange={this.onValueChangeTipo.bind(this)}>
                <Picker.Item label="Emprego" value="emprego" />
                <Picker.Item label="Estágio" value="estagio" />
              </Picker>
            </Item>

            <Item inlineLabel onPress={this.showDateTimePicker}>
              <Label style={{width: 110}}>Data Final</Label>
              <Input
                disabled
                value={`${format(
                  new Date(this.state.selectedDate),
                  'dd/MM/yyyy',
                )}`}
                onChangeText={null}
              />
            </Item>

            <Item stackedLabel>
              <Label>Requisitos</Label>
              <Textarea
                rowSpan={3}
                bordered
                placeholder="Requisitos"
                value={this.state.requisitos}
                onChangeText={requisitos => this.setState({requisitos})}
              />
            </Item>
            <Item stackedLabel>
              <Label>Descrição</Label>
              <Textarea
                rowSpan={3}
                bordered
                placeholder="descricao"
                value={this.state.descricao}
                onChangeText={descricao => this.setState({descricao})}
              />
            </Item>
          </Form>

          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
            titleIOS={'Selecione a Data'}
            date={new Date()}
          />

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

export default Empresa;
