import { Webhook } from './types';

export interface IWebhookSource {
  async get (ipfsHash): Promise<Webhook>;
}
