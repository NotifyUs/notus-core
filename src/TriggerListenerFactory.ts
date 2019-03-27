import { TriggerListener } from './TriggerListener';
import { SubscriptionListener } from './SubscriptionListener';
import { ITriggerListener } from './ITriggerListener';
import { ILogManager } from './ILogManager';

export class TriggerListenerFactory {
  private web3: any;
  private logManager: ILogManager;

  constructor(web3: any, logManager: ILogManager) {
    this.web3 = web3;
    this.logManager = logManager;
  }

  create (id, trigger): ITriggerListener {
    let triggerListener;
    switch (trigger.triggerType) {
      case 'EventTrigger':
        console.log(`Creating EventTrigger webhook with ${id}`)
        triggerListener = new TriggerListener(this.web3, this.logManager);
        break
      case 'GraphTrigger':
        console.log(`Creating GraphTrigger webhook with ${id}`)
        triggerListener = new SubscriptionListener(this.logManager);
        break
      default:
        throw new Error(`Unknown triggerType ${trigger.triggerType}`);
    }
    return triggerListener;
  }
}
