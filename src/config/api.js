import {create} from 'apisauce';
import AsyncStorage from '@react-native-community/async-storage';

const PORTA = '3001';
const IP = 'http://192.168.0.106';
const DNS = 'http://app4all.com.br:5001';
const api = create({
  baseURL: `${DNS}/api`, //DOCKER
  // baseURL: `${IP}:${PORTA}/api`, //LOCAL
  timeout: 15000,
});

api.addAsyncRequestTransform(request => async () => {
  const token = await AsyncStorage.getItem('@Estag:tokenR');

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
