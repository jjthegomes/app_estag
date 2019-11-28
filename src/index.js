import React, {Component} from 'react';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';
import {createStore, applyMiddleware, compose} from 'redux';
console.disableYellowBox = true;

import Routes from './routes';
import reducers from './reducers';

export default class App extends Component {
  render() {
    return (
      <Provider
        store={createStore(reducers, {}, compose(applyMiddleware(ReduxThunk)))}>
        <Routes />
      </Provider>
    );
  }
}
