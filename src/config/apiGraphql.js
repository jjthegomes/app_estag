import {create} from 'apisauce';
import AsyncStorage from '@react-native-community/async-storage';

const PORTA = '3000';
const IP = 'http://192.168.0.106';
const DNS = 'http://app4all.com.br:5000';
const api = create({
  baseURL: `${DNS}`, //DOCKER
  //baseURL: `${IP}:${PORTA}`, //LOCAL
  timeout: 15000,
});

api.addAsyncRequestTransform(request => async () => {
  const token = await AsyncStorage.getItem('@Estag:tokenG');

  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
});

api.addResponseTransform(response => {
  if (!response.ok) {
    throw response;
  }
});

export default api;
