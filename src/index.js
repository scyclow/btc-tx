// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Client from './client'

const client = new Client('wss://ws.blockchain.info/inv')

// $FlowFixMe
ReactDOM.render(<App client={client}/>, document.getElementById('root'));
