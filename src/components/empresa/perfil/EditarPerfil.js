import React, {Component} from 'react';
import {StatusBar} from 'react-native';
import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Body,
  Right,
  Icon,
  Form,
  Item,
  Input,
  Label,
  View,
  Left,
  Picker,
  Text,
} from 'native-base';
import {connect} from 'react-redux';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {format} from 'date-fns';
import {COLORS} from '../../../utils/colors';
import api from '../../../config/api';

class EditarPerfil extends Component {
  constructor() {
    super();

    this.state = {
      selectedDate: format(new Date(), 'dd/MM/yyyy'),
      selectedSex: 'null',
    };
  }

  UNSAFE_componentWillMount = () => {
    const {usuario} = this.props;
    let date = format(new Date(), 'dd/MM/yyyy');
    let sex = 'Outro';

    if (usuario.genero !== undefined) {
      sex = usuario.usuario.genero;
    }

    if (usuario.usuario.dataNascimento !== undefined) {
      date = format(new Date(usuario.usuario.dataNascimento), 'dd/MM/yyyy');
    }

    this.setState({
      selectedDate: date,
      selectedSex: sex,
    });
  };

  showDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: true});
  };

  hideDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: false});
  };

  handleDatePicked = async date => {
    let today = new Date(date);

    this.setState({selectedDate: format(today, 'dd/MM/yyyy')});
    this.hideDateTimePicker();
  };

  onValueChange(value) {
    this.setState({selectedSex: value});
  }

  handleEditar = async () => {
    const {usuario} = this.props;
    let newEmpresa = {
      nome: 'Estag2',
      email: 'estag@hotmail.com',
    };

    try {
      const response = await api.put('/empresa/' + usuario._id, newEmpresa);
      console.log(response.data);
      this.props.navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const {usuario} = this.props;

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
            <Title style={{color: '#fff', fontSize: 24}}>Editar Perfil</Title>
          </Body>
          <Right style={{flex: 1}} />
        </Header>
        <StatusBar backgroundColor={COLORS.THEME} barStyle="light-content" />

        <Content padder>
          <Form>
            <Item stackedLabel>
              <Label>Nome Reponsavel</Label>
              <Input value={usuario.usuario.nome || ''} />
            </Item>
            <Item stackedLabel>
              <Label>Email</Label>
              <Input value={usuario.usuario.email || ''} />
            </Item>

            <Item inlineLabel>
              <Label>Gênero</Label>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                style={{width: undefined, marginLeft: 5}}
                placeholder="Genero"
                placeholderStyle={{color: '#bfc6ea'}}
                placeholderIconColor="#007aff"
                selectedValue={this.state.selectedSex}
                onValueChange={this.onValueChange.bind(this)}>
                <Picker.Item label="Selecione Genero" value="null" />
                <Picker.Item label="Masculino" value="Masculino" />
                <Picker.Item label="Feminino" value="Feminino" />
                <Picker.Item label="Outro" value="Outro" />
              </Picker>
            </Item>

            <Item stackedLabel onPress={this.showDateTimePicker}>
              <Label>Data Nascimento</Label>
              <Input
                disabled
                value={`${this.state.selectedDate}`}
                onChangeText={null}
              />
            </Item>
            <Item stackedLabel>
              <Label>Nome da Empresa</Label>
              <Input value={usuario.nome || ''} />
            </Item>
            <Item stackedLabel>
              <Label>Email da Empresa</Label>
              <Input value={usuario.email || ''} />
            </Item>
            <Item stackedLabel last>
              <Label>Telefone</Label>
              <Input value={usuario.telefone || ''} />
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
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <Button success block onPress={() => this.handleEditar()}>
              <Text>Savar</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  usuario: state.Auth.usuario,
});
export default connect(mapStateToProps, {})(EditarPerfil);
