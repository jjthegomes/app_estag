import {combineReducers} from 'redux';
import Auth from './auth';
import Counter from './counter';

export default combineReducers({
  Auth,
  Counter,
});
