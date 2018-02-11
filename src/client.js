// @flow

const exTransaction = {"op": "utx", "x": {"lock_time": 0, "ver": 1, "size": 192, "inputs": [{"sequence": 4294967295, "prev_out": {"spent": true, "tx_index": 99005468, "type": 0, "addr": "1BwGf3z7n2fHk6NoVJNkV32qwyAYsMhkWf", "value": 65574000, "n": 0, "script": "76a91477f4c9ee75e449a74c21a4decfb50519cbc245b388ac"}, "script": "483045022100e4ff962c292705f051c2c2fc519fa775a4d8955bce1a3e29884b2785277999ed02200b537ebd22a9f25fbbbcc9113c69c1389400703ef2017d80959ef0f1d685756c012102618e08e0c8fd4c5fe539184a30fe35a2f5fccf7ad62054cad29360d871f8187d"} ], "time": 1440086763, "tx_index": 99006637, "vin_sz": 1, "hash": "0857b9de1884eec314ecf67c040a2657b8e083e1f95e31d0b5ba3d328841fc7f", "vout_sz": 1, "relayed_by": "127.0.0.1", "out": [{"spent": false, "tx_index": 99006637, "type": 0, "addr": "1A828tTnkVFJfSvLCqF42ohZ51ksS3jJgX", "value": 65564000, "n": 0, "script": "76a914640cfdf7b79d94d1c980133e3587bd6053f091f388ac"} ] } }
const exBlock = {"op": "block", "x": {"txIndexes": [3187871, 3187868 ], "nTx": 0, "totalBTCSent": 0, "estimatedBTCSent": 0, "reward": 0, "size": 0, "blockIndex": 190460, "prevBlockIndex": 190457, "height": 170359, "hash": "00000000000006436073c07dfa188a8fa54fefadf571fd774863cda1b884b90f", "mrklRoot": "94e51495e0e8a0c3b78dac1220b2f35ceda8799b0a20cfa68601ed28126cfcc2", "version": 1, "time": 1331301261, "bits": 436942092, "nonce": 758889471 } }

export type Transaction = typeof exTransaction & { op: 'utx' };
export type TransactionFn = Transaction => mixed;

export type Block = typeof exBlock & { op: 'block' };
export type BlockFn = Block => mixed;

export default class Client {
  ws: WebSocket;
  uri: string;
  onTransactionFns: Array<TransactionFn> = [];
  onBlockFns: Array<BlockFn> = [];

  constructor(uri: string) {
    const ws = new WebSocket(uri)
    this.ws = ws;
    this.onConnect().then(() => {
      ws.send(JSON.stringify({ op: 'unconfirmed_sub' }))
      ws.send(JSON.stringify({ op: 'blocks_sub' }))

      ws.onmessage = (e: MessageEvent) => {
        if (typeof e.data !== 'string') return;
        const data: Transaction | Block = JSON.parse(e.data);

        if (data.op === 'utx') {
          this.onTransactionFns.forEach(fn => fn(data));

        } else if (data.op === 'block') {
          this.onBlockFns.forEach(fn => fn(data));
        }
      }
    })
  }

  close() {
    this.ws.send(JSON.stringify({ op: 'unconfirmed_unsub' }))
    this.ws.send(JSON.stringify({ op: 'blocks_unsub' }))
  }

  onConnect(): Promise<*> {
    return new Promise((resolve) => {
      this.ws.onopen = resolve
    })
  }

  onTransaction(cb: TransactionFn) {
    this.onTransactionFns.push(cb)
  }

  onBlock(cb: BlockFn) {
    this.onBlockFns.push(cb)
  }
}
