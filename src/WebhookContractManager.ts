import { eventProjection } from './eventProjection';
import { Webhook } from './types';
import { IPFSWebhookSource } from './IPFSWebhookSource';
import { WebhookListener } from './WebhookListener'
import { WebhookListenerFactory } from './WebhookListenerFactory';
import { WebhookManager } from './WebhookManager';
import notusArtifact from 'notus-contracts/build/contracts/Notus.json'
import * as utils from 'web3-utils';

export class WebhookContractManager {
  private web3: any;
  private webhookSource: IPFSWebhookSource;
  private webhookManager: WebhookManager;
  private subscription: any;
  private address: string;

  constructor (
    web3: any,
    address: string,
    webhookSource: IPFSWebhookSource,
    webhookManager: WebhookManager
  ) {
    this.web3 = web3;
    this.address = address;
    this.webhookSource = webhookSource;
    this.webhookManager = webhookManager;
  }

  async start() {
    if (this.subscription) { return }

    var contract = this.getContract()

    var subscription = contract.events.allEvents()

    subscription.on('data', this.onData.bind(this));
    subscription.on('error', this.onError.bind(this));

    this.subscription = subscription;

    const events = await contract.getPastEvents('allEvents', {
      fromBlock: 0,
      toBlock: 'latest'
    });

    console.log(`Found ${events.length} past events`);

    const ipfsHashes = eventProjection(events);

    await Promise.all(Array.from(ipfsHashes).map(async (ipfsHash) => {
      const webhook: Webhook = await this.webhookSource.get(ipfsHash)
      this.webhookManager.add(ipfsHash, webhook);
    }));
  }

  stop() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  onData(log) {
    switch (log.event) {
      case 'Registered':
        this.onRegistered(log);
        break;
      case 'Unregistered':
        this.onUnregistered(log);
        break;
      // no default
    }
  }

  onError(error) {
    console.error(error);
  }

  onRegistered(log) {
    const ipfsHash = utils.toUtf8(log.returnValues.ipfsHash);
    return this.webhookSource.get(ipfsHash)
      .then((webhook: Webhook) => {
        console.log(`Starting webhook ${ipfsHash}...`)
        this.webhookManager.add(ipfsHash, webhook)
      })
      .catch(error => {
        console.log(`Error starting webhook ${ipfsHash}: ${error.message}`)
        console.error(error)
      });
  }

  onUnregistered(log) {
    const ipfsHash = utils.toUtf8(log.returnValues.ipfsHash);
    this.webhookManager.remove(ipfsHash)
  }

  getContract () {
    return new this.web3.eth.Contract(notusArtifact.abi, this.address)
  }
}
