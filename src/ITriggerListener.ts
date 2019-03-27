import { Trigger } from './types'

export interface ITriggerListener {
  start(id: any, trigger: Trigger, callback: any);
  stop();
}
