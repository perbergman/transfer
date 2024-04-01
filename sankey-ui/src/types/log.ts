interface Log {
    id: string;
    id2: string;
    payload: Payload;
    decoded: Decoded;
    created: string;
    is_updated?: any;
  }
  
  interface Decoded {
    data: Datum[];
    event: Event;
  }
  
  interface Event {
    name: string;
  }
  
  interface Datum {
    name: string;
    type: string;
    value: string;
  }
  
  interface Payload {
    data: string;
    _type: string;
    index: number;
    topics: string[];
    address: string;
    blockHash: string;
    blockNumber: number;
    transactionHash: string;
    transactionIndex: number;
  }

  export type {Log, Payload, Decoded, Event, Datum}
  