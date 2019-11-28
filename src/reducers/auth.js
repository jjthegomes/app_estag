import {
  SET_USUARIO,
  REQUEST_LOGIN_SUCCESS,
  REQUEST_LOGIN_ERRO,
  REQUEST_LOGIN,
} from '../actions/types';

const INITIAL_STATE = {
  email: '',
  senha: '',
  nome: '',
  usuario: null,

  loading: false,
  erro: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_USUARIO:
      return {
        ...state,
        usuario: action.payload,
        erro: '',
      };

    case REQUEST_LOGIN:
      return {
        ...state,
        loading: action.data,
      };

    case REQUEST_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        usuario: action.data,
      };

    case REQUEST_LOGIN_ERRO:
      return {
        ...state,
        loading: false,
        erro: action.data,
      };

    default:
      return state;
  }
};
