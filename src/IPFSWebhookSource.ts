import { Webhook } from './types';
import { TriggerListener } from './TriggerListener';
import { validator } from './validator';
import { IWebhookSource } from './IWebhookSource';

export class IPFSWebhookSource implements IWebhookSource {
  private _ipfs: any;

  constructor (ipfs: any) {
    this._ipfs = ipfs;
  }

  async get (ipfsHash): Promise<Webhook> {
    const [{ path, content }] = await this._ipfs.get(ipfsHash);
    const json = JSON.parse(content);
    const validate = validator();
    if (!validate(json)) {
      throw new Error(
        validate.errors.map(err => err.message).join(', ')
      );
    }
    json.ipfsHash = ipfsHash
    return json;
  }
}
