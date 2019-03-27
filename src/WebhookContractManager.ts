import { eventProjection } from './eventProjection';
import { Webhook } from './types';
import { IPFSWebhookSource } from './IPFSWebhookSource';
import { TriggerListener } from './TriggerListener'
import { TriggerListenerFactory } from './TriggerListenerFactory';
import { TriggerManager } from './TriggerManager';
import { LogManager } from './LogManager';
import { formatResult } from './formatResult'
import notusArtifact from 'notus-contracts/build/contracts/Notus.json'
import * as utils from 'web3-utils';

export class WebhookContractManager {
  private subscription: any;

  constructor (
    private readonly web3: any,
    private readonly address: string,
    private readonly fetch: Function,
    private readonly webhookSource: IPFSWebhookSource,
    private readonly triggerManager: TriggerManager,
    private readonly logManager: LogManager
  ) {}

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
      this.registerWebhook(await this.webhookSource.get(ipfsHash))
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
        this.registerWebhook(webhook)
        console.log(`Starting webhook ${ipfsHash}...`)
      })
      .catch(error => {
        console.log(`Error starting webhook ${ipfsHash}: ${error.message}`)
        console.error(error)
      });
  }

  registerWebhook (webhook) {
    const { ipfsHash, trigger, url } = webhook
    const triggerListener = this.triggerManager.add(ipfsHash, trigger);
    triggerListener.start(ipfsHash, trigger, (error, log) => {
      let result = formatResult(webhook, log);
      this.fetch(url, {
        method: "POST",
        body: JSON.stringify(result),
      }).catch(error => {
        this.logManager.pushLog(ipfsHash, {
          type: "error",
          message: error.message
        });
        console.error(error);
      });
    })
  }

  onUnregistered(log) {
    const ipfsHash = utils.toUtf8(log.returnValues.ipfsHash);
    this.triggerManager.remove(ipfsHash)
  }

  getContract () {
    return new this.web3.eth.Contract(notusArtifact.abi, this.address)
  }
}
