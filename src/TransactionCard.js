// @flow

import * as React from 'react';
import './TransactionCard.css'
import { type Transaction} from './client'

type Props = {
  transaction: Transaction
};

const satoshisPerBtc = 10e8;

export default function TransactionCard({ transaction }: Props) {
  const utx = transaction.x
  const inputValue = utx.inputs.reduce((sum, input) => input.prev_out.value + sum, 0) / satoshisPerBtc;
  const outputValue = utx.out.reduce((sum, output) => output.value + sum, 0) / satoshisPerBtc;

  const fee = inputValue - outputValue

  return (
    <div className="TransactionCard">
      <div className="hash">{utx.hash}</div>
      <div>Inputs ({utx.inputs.length}): {inputValue}</div>
      <div>Outputs ({utx.out.length}): {outputValue}</div>
      <div>Tx Fee: {fee}</div>
    </div>
  )
}

