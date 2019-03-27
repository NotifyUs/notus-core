import { Trigger } from './types';
import { ITriggerListener } from './ITriggerListener'
import { TriggerListener } from './TriggerListener'
import { TriggerListenerFactory } from './TriggerListenerFactory';

export class TriggerManager {
  private listeners: Map<string, TriggerListener>;
  private triggerListenerFactory;

  constructor (
    triggerListenerFactory: TriggerListenerFactory
  ) {
    this.triggerListenerFactory = triggerListenerFactory;
    this.listeners = new Map();
  }

  add(id, trigger: Trigger): ITriggerListener {
    if (this.listeners[id]) {
      throw new Error(`Trigger with id ${id} is already defined`)
    }
    this.listeners[id] = this.triggerListenerFactory.create(id, trigger)
    return this.listeners[id]
  }

  remove(id) {
    let triggerListener = this.listeners[id]
    if (triggerListener) {
      console.log(`Stopping trigger ${id}...`)
      triggerListener.stop()
      delete this.listeners[id]
    }
  }
}
