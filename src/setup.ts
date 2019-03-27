import Web3 from 'web3';
import ipfsClient from 'ipfs-http-client';

import { IPFSWebhookSource } from './IPFSWebhookSource';
import { TriggerListenerFactory } from './TriggerListenerFactory';
import { WebhookContractManager } from './WebhookContractManager';
import { LogManager } from './LogManager';

export async function setup(
  notusContractAddress: string,
  providerUrl: string,
  ipfsUrl: string,
  logManager: LogManager
) {

  const web3 = new Web3(new Web3.providers.WebsocketProvider(providerUrl));
  const ipfs = ipfsClient('ipfs.infura.io', '5001', { protocol: 'https'});

  const webhookSource = new IPFSWebhookSource(ipfs);
  const webhookListenerFactory = new TriggerListenerFactory(web3, logManager);
  const webhookManager = new WebhookContractManager(
    web3,
    notusContractAddress,
    webhookSource,
    webhookListenerFactory
  );
  console.log('Starting manager...')
  await webhookManager.start();
  console.log('Manager started')
}
