import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  StatusBar,
  Text as TextRN,
  TouchableOpacity,
} from 'react-native';
import {
  Icon,
  List,
  ListItem,
  Button,
  Header,
  Right,
  Left,
  View,
  Text,
  Title,
  Spinner,
  Container,
  Content,
  Body,
  Textarea,
} from 'native-base';

import { format } from 'date-fns';
import { connect } from 'react-redux';
import { COLORS } from '../../../utils/colors';

class Perfil extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      filePath: null,
      profile_image_file:
        'http://i0.wp.com/www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png',
    };
  }

  getDataNascimento = date => {
    try {
      return format(new Date(date), 'dd MMMM yyyy');
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  logout = async () => {
    try {
      await AsyncStorage.removeItem('@Estag:token');
      this.props.navigation.navigate('Login');
    } catch (e) {
      console.log(e);
    }
  };

  renderTextArea = (title, text) => {
    try {
      let items = text.split(',');
      let newText = '';
      items.map(item => (newText += `${item.trim()}\n`));

      //console.log(newText);

      return (
        <View style={{ marginBottom: -20 }}>
          <View>
            <Text style={styles.leftText}>{title}</Text>
          </View>
          <View>
            <Textarea value={newText || 'N/A'} disabled rowSpan={4} />
          </View>
        </View>
      );
    } catch (error) {
      console.log(error);
      return <View />;
    }
  };

  renderRedeSocial = () => {
    const { usuario } = this.props;
    if (usuario.redeSocial) {
      return (
        <View>
          <ListItem>
            <Left>
              <Text style={styles.leftText}>Lattes</Text>
            </Left>
            <Text>
              {this.getCampoOpcional(usuario.redeSocial.lattes) || 'N/A'}
            </Text>
          </ListItem>
          <ListItem>
            <Left>
              <Text style={styles.leftText}>Linkedin</Text>
            </Left>
            <Text>
              {this.getCampoOpcional(usuario.redeSocial.linkedin) || 'N/A'}
            </Text>
          </ListItem>
          <ListItem last>
            <Left>
              <Text style={styles.leftText}>Facebook</Text>
            </Left>
            <Text>
              {this.getCampoOpcional(usuario.redeSocial.facebook) || 'N/A'}
            </Text>
          </ListItem>
        </View>
      )
    } else { return <View />; }
  };

  getCampoOpcional = (campo = null) => {
    console.log(campo);
    try {
      if (campo !== undefined) {
        return campo;
      }

      return false;
    } catch (error) {
      return false;
    }
  };

  render() {
    const { usuario } = this.props;
    return (
      <Container>
        <Header style={{ backgroundColor: COLORS.THEME }}>
          <Left style={{ flex: 1 }} />
          <Body style={{ flex: 2 }}>
            <Title style={{ color: '#fff', fontSize: 24 }}>Perfil</Title>
          </Body>
          <Right style={{ flex: 1 }} />
        </Header>
        <StatusBar backgroundColor={COLORS.THEME} barStyle="light-content" />

        <Content>
          {this.state.loading ? (
            <Spinner color={COLORS.THEME} size="large" />
          ) : (
              <View>
                <View style={{ flexDirection: 'row', padding: 20 }}>
                  <Image
                    style={styles.avatar}
                    source={{ uri: this.state.profile_image_file }}
                  />

                  <View style={{ padding: 20, marginTop: -10 }}>
                    <Text>{usuario.nome.split(' ')[0] || ''}</Text>
                    <View
                      style={{
                        backgroundColor: '#F8F8F8',
                        width: 120,
                        height: 2,
                        marginBottom: 20,
                        marginTop: 5,
                      }}
                    />
                    <Text>{usuario.nome.split(' ')[1] || ''}</Text>
                    <View
                      style={{
                        backgroundColor: '#F8F8F8',
                        width: 120,
                        height: 2,
                        marginTop: 5,
                      }}
                    />
                    <View style={{ marginBottom: -20 }}>
                      <Button
                        transparent
                        onPress={() =>
                          this.props.navigation.navigate('EditarPerfil')
                        }>
                        <TextRN style={{ color: COLORS.THEME }}>
                          Editar Perfil
                      </TextRN>
                        <Icon
                          style={{ color: COLORS.THEME, fontSize: 18 }}
                          type="Foundation"
                          name="pencil"
                        />
                      </Button>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    backgroundColor: '#F8F8F8',
                    width: 630,
                    height: 15,
                  }}
                />

                <List>
                  <ListItem>
                    <Left>
                      <Text style={styles.leftText}>Email</Text>
                    </Left>
                    <Text>{usuario.email || 'N/A'}</Text>
                  </ListItem>

                  <ListItem>
                    <Left>
                      <Text style={styles.leftText}>Data Nascimento</Text>
                    </Left>
                    <Text>
                      {this.getDataNascimento(usuario.dataNascimento) || 'N/A'}
                    </Text>
                  </ListItem>
                  <ListItem last>
                    <Left>
                      <Text style={styles.leftText}>Gênero</Text>
                    </Left>
                    <Text>{usuario.genero || 'Outro'}</Text>
                  </ListItem>

                  <View
                    style={{
                      backgroundColor: '#F8F8F8',
                      width: 630,
                      height: 15,
                    }}
                  />

                  <ListItem>
                    {this.renderTextArea(
                      'Formação Acadêmico',
                      usuario.formacaoAcademica,
                    )}
                  </ListItem>
                  <ListItem>
                    {this.renderTextArea(
                      'Formação Profissional',
                      usuario.formacaoProfissional,
                    )}
                  </ListItem>
                  <ListItem>
                    {this.renderTextArea('Habilidades', usuario.habilidades)}
                  </ListItem>
                  <ListItem last>
                    {this.renderTextArea('Experiencia', usuario.experiencia)}
                  </ListItem>

                  <View
                    style={{
                      backgroundColor: '#F8F8F8',
                      width: 630,
                      height: 15,
                    }}
                  />

                  {this.renderRedeSocial()}
                </List>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20,
                  }}>
                  <Button dark block onPress={() => this.logout()}>
                    <Text>Sair</Text>
                  </Button>
                </View>
              </View>
            )}
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    padding: 20,
  },
  leftText: {
    color: '#C8C8C8',
    fontWeight: '400',
  },
});

const mapStateToProps = state => ({
  usuario: state.Auth.usuario,
});

export default connect(
  mapStateToProps,
  {},
)(Perfil);
