import { GraphTrigger } from './types'

export const graphQueryFactory = ({ subscriptionQuery, websocketUri }: { subscriptionQuery: string, websocketUri: string }):GraphTrigger => ({
  triggerType: "GraphTrigger",
  subscriptionQuery,
  websocketUri,
});
