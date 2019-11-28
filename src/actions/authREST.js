import {
  SET_USUARIO,
  REQUEST_LOGIN_SUCCESS,
  REQUEST_LOGIN_ERRO,
  REQUEST_LOGIN,
} from './types';

import api from '../config/api';
import AsyncStorage from '@react-native-community/async-storage';
import {Alert} from 'react-native';

export const login = (credentials, navigation, screen = 'Chat') => {
  return async dispatch => {
    dispatch({
      type: REQUEST_LOGIN,
      data: true,
    });
    try {
      const response = await api.post('/auth/', credentials);
      const {success, data} = response.data;

      if (success) {
        setUserCache(data.token, credentials);
        successHandle(credentials, dispatch);
        return navigation.navigate(screen);
      } else {
        errorHandle(response.data, dispatch);
        return Alert.alert('ERROR', 'Something went wrong! Try again.');
      }
    } catch (erro) {
      errorHandle(erro, dispatch);
    }
  };
};

const successHandle = (data, dispatch) => {
  dispatch({
    type: REQUEST_LOGIN_SUCCESS,
    data,
  });
};

const errorHandle = (data, dispatch) => {
  console.log(data);
  if (data.problem == 'NETWORK_ERROR') {
    return dispatch({
      type: REQUEST_LOGIN_ERRO,
      data: 'Network error',
    });
  }

  return dispatch({
    type: REQUEST_LOGIN_ERRO,
    data: 'Invalid Credentials',
  });
};

export const setUserCache = (token, user) => {
  try {
    AsyncStorage.multiSet([
      ['@Estag:token', token],
      ['@Estag:usuario', JSON.stringify(user)],
    ]);
  } catch (error) {
    console.log(error);
  }
};

export const setUsuario = usuario => {
  return {
    type: SET_USUARIO,
    payload: usuario,
  };
};
