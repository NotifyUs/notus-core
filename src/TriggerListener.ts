import Web3 from "web3";
import { EventTrigger, Trigger, QueryResult } from "./types";
import { LogManager } from './LogManager'
import { ITriggerListener } from './ITriggerListener'

export class TriggerListener implements ITriggerListener {
  public subscription: any;

  constructor (private readonly web3: any, private readonly logManager: LogManager) {}

  public start(id, trigger: Trigger, callback) {
    if (this.subscription) { throw new Error("we've already started"); }
    if (trigger.triggerType === 'EventTrigger') {
      const eventTrigger: EventTrigger = <EventTrigger> trigger;
      const { address, topics } = eventTrigger

      this.logManager.pushLog(id, {
        type: "info",
        message: `Subscribing to ${address} with topics ${topics.join(', ')}`
      })

      this.subscription = this.web3.eth.subscribe("logs", {
        address: eventTrigger.address
      });

      this.subscription.on("data", this.onData.bind(this, id, trigger, callback));
      this.subscription.on("error", this.onError.bind(this, id, trigger, callback));
    } else {
      throw new Error(`Unrecognized query type ${trigger.triggerType}`)
    }
  }

  public onData(id, trigger: Trigger, callback: (err: any, result: any) => void, log: any) {
    this.logManager.pushLog(id, log);
    callback(null, log)
  }

  public onError(id, trigger: Trigger, callback: (err: any, result: any) => void, error: Error) {
    this.logManager.pushLog(id, {
      type: "error",
      message: error.message
    });
    callback(error, null)
  }

  public stop() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
}
