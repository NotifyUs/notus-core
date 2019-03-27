import { ITriggerListener } from './ITriggerListener';
import { Webhook, GraphTrigger } from './types';
import { apolloClientFactory } from './apolloClientFactory';
import gql from 'graphql-tag';
import { LogManager } from './LogManager';
import { getMainDefinition } from './getMainDefinition';
import { formatResult } from './formatResult';

export class SubscriptionListener implements ITriggerListener {
  private client: any;
  private queryObservable: any;

  constructor (private readonly logManager: LogManager) {}

  public start(id, graphTrigger: GraphTrigger, callback: (err: any, result: any) => void) {
    try {
      this.client = apolloClientFactory(graphTrigger.websocketUri)
      let query = gql(graphTrigger.subscriptionQuery)
      const { kind, operation } = getMainDefinition(query);
      const isSubscription = kind === 'OperationDefinition' && operation === 'subscription';
      if (!isSubscription) {
        throw new Error(`Configured query is not a graphql subscription`)
      }
      this.queryObservable = this.client.subscribe({
        fetchPolicy: 'network-only',
        query,
        variables: {
          time: ((new Date()).getTime() / 1000)
        }
      })

      this.queryObservable.subscribe({
        next: this.onNext.bind(this, id, graphTrigger, callback),
        error: this.onError.bind(this, id, graphTrigger, callback)
      })
    } catch (error) {
      this.onError(id, graphTrigger, callback, error)
    }
  }

  onNext(id, graphTrigger, callback, data) {
    callback(null, data)
    this.logManager.pushLog(id, data);
  }

  onError(id, graphTrigger, callback, error) {
    callback(error, null)
    this.logManager.pushLog(id, {
      type: "error",
      message: error.message
    });
  }

  public stop() {
    if (this.queryObservable) {
      this.queryObservable.unsubscribe();
      delete this.queryObservable;
      this.queryObservable = null;
    }
    if (this.client) {
      this.client.stop();
      delete this.client;
      this.client = null;
    }
  }
}
