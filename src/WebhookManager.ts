import { Webhook } from './types';
import { WebhookListener } from './WebhookListener'
import { WebhookListenerFactory } from './WebhookListenerFactory';

export class WebhookManager {
  private listeners: Map<string, WebhookListener>;
  private webhookListenerFactory;

  constructor (
    webhookListenerFactory: WebhookListenerFactory
  ) {
    this.webhookListenerFactory = webhookListenerFactory;
    this.listeners = new Map();
  }

  add(id, webhook: Webhook) {
    if (this.listeners[id]) {
      throw new Error(`Webhook with id ${id} is already defined`)
    }
    this.listeners[id] = this.webhookListenerFactory.create(webhook)
  }

  remove(id) {
    let webhookListener = this.listeners[id]
    if (webhookListener) {
      console.log(`Stopping webhook ${id}...`)
      webhookListener.stop()
      delete this.listeners[id]
    }
  }
}
