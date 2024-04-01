interface Block {
    id: string;
    payload: Payload;
    created: string;
    protocol: string;
    is_updated?: any;
  }
  
  interface Payload {
    hash: string;
    _type: string;
    miner: string;
    nonce: string;
    number: number;
    gasUsed: string;
    gasLimit: string;
    extraData: string;
    timestamp: number;
    difficulty: string;
    parentHash: string;
    transactions: string[];
    baseFeePerGas?: any;
  }
  
  interface Blocks {
    date:string;
    block: string;
    urls: string[];
  }

  export type {Block, Payload, Blocks}
