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

const maxTx = 50;
const maxVolume = 0.04;

class App extends Component<Props, State> {
  state = {
    transactions: [],
    mute: false
  };

  gain: GainNode;
  source: OscillatorNode;

  initAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();

      this.source = ctx.createOscillator();
      this.gain = ctx.createGain();

      this.source.connect(this.gain)
      this.gain.connect(ctx.destination)
      this.gain.gain.value = 0
      this.source.frequency.value = 0
      this.source.start()
    } catch (e) {
      console.error(e)
    }
  }

  _audioTimeout: TimeoutID;
  playAudio(utx: Transaction) {
    this.gain.gain.value = maxVolume;
    const inputValue = utx.x.inputs.reduce((sum, input) => input.prev_out.value + sum, 0) / 10e8;
    this.source.frequency.value = Math.min(Math.max(8000 * inputValue, 300), 10000)

    clearTimeout(this._audioTimeout);
    this._audioTimeout = setTimeout(() => {
      this.gain.gain.value = 0;
    }, 200);
  }

  mute = () => {
    this.setState({ mute: !this.state.mute })
  }

  componentDidMount() {
    this.initAudio();
    this.props.client.onTransaction((utx: Transaction) => {
      if (!this.state.mute) this.playAudio(utx)
      this.setState(state => ({
        ...state,
        transactions: [utx, ...state.transactions.slice(0, maxTx)]
      }))
    })
  }

  render() {
    return (
      <div className="App">
        <h1>Bitcoin Transactions</h1>
        <div className="mute" onClick={this.mute}>{this.state.mute ? 'unmute' : 'mute'}</div>
        {this.state.transactions.map((utx, i) => (
          <TransactionCard key={i} transaction={utx} />
        ))}
      </div>
    );
  }
}

export default App;
