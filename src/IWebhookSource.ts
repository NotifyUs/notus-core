import { Webhook } from './types';

export interface IWebhookSource {
  get (ipfsHash): Promise<Webhook>;
}
