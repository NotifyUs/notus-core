import { EventTrigger } from './types'

export const eventQueryFactory = ({ address, topics }: { address: string, topics: Array<string> }):EventTrigger => ({
  triggerType: "EventTrigger",
  address,
  topics,
});
