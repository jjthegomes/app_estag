import {CONTAR} from '../actions/types';

const INITIAL_STATE = {
  contador: 0,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CONTAR:
      return {
        ...state,
        contador: state.contador + 1,
      };

    default:
      return state;
  }
};
