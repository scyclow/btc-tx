// @flow

import React, { Component } from 'react';
import Client, { type Transaction} from './client'
import TransactionCard from './TransactionCard'

import './App.css';

type Props = {
  client: Client
};

type State = {
  transactions: Array<Transaction>
};

const maxTx = 50

class App extends Component<Props, State> {
  state = {
    transactions: []
  };

  componentDidMount() {
    this.props.client.onTransaction((utx: Transaction) => {
      this.setState(state => ({
        transactions: [utx, ...state.transactions.slice(0, maxTx)]
      }))
    })
  }

  render() {
    return (
      <div className="App">
        <h1>Bitcoin Transactions</h1>
        {this.state.transactions.map((utx, i) => (
          <TransactionCard key={i} transaction={utx} />
        ))}
      </div>
    );
  }
}

export default App;
