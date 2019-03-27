export interface Webhook {
  version: string;
  ipfsHash: string;
  url: string;
  trigger: Trigger;
  paramMapping: Array<ParamMapping>;
}

export interface ParamMapping {
  paramName: string,
  resultPath: string
}

export interface Trigger {
  triggerType: string;
}

export interface EventTrigger extends Trigger {
  address: string;
  topics: String[];
}

export interface GraphTrigger extends Trigger {
  websocketUri: string,
  subscriptionQuery: string
}

export interface QueryResult {
  webhook: Webhook;
  result: Object;
}
