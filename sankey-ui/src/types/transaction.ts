import { Log } from "./log";
import {Block} from "./block";

interface OneBlock {
    block: Block;
    transactions: Transaction[];
}

interface Transaction {
    id: string;
    payload: Payload;
    created: string;
    decoded: Decoded;
    current_state: string;
    finished?: any;
    is_updated?: any;
    block_id: string;
    contract: string;
    instance: string;
  }
  
interface Decoded {
    data: Datum[];
    function: Function;
}

interface Function {
    readonly name: string;
}

interface Datum {
    readonly name: string;
    type: string;
    value: string;
}
  
  interface Payload {
    to: string;
    from: string;
    hash: string;
    logs: Log[];
    _type: string;
    index: number;
    status: number;
    gasUsed: string;
    gasPrice: string;
    blockHash: string;
    logsBloom: string;
    blockNumber: number;
    contractAddress?: any;
    cumulativeGasUsed: string;
  }
  
export type {OneBlock, Transaction, Payload, Decoded, Datum, Function}