import { WebhookContractManager } from '../WebhookContractManager'
import { IPFSWebhookSource } from '../IPFSWebhookSource'
import { LogManager } from '../LogManager'
import { TriggerManager } from '../TriggerManager'
import { webhookFactory } from './support/webhookFactory'

import * as utils from 'web3-utils'

jest.mock('../eventProjection')

describe('WebhookContractManager', () => {
  let web3,
      subscribe,
      fetch,
      get,
      manager,
      triggerListenerFactory,
      contractAllEvents,
      allEventsSubscription,
      contractGetPastEvents

  let triggerListener, webhook

  beforeEach(() => {
    fetch = jest.fn()
    allEventsSubscription = {
      on: jest.fn()
    }
    contractAllEvents = jest.fn(() => allEventsSubscription)
    contractGetPastEvents = jest.fn(() => [])
    let Contract = jest.fn(() => ({
      events: {
        allEvents: contractAllEvents
      },
      getPastEvents: contractGetPastEvents
    }))
    webhook = webhookFactory()
    get = jest.fn(() => Promise.resolve(webhook))
    web3 = {
      utils: {
        sha3: utils.sha3
      },
      eth: {
        Contract
      }
    }
    let webhookSource = new IPFSWebhookSource('ipfs')
    let logManager = new LogManager()
    triggerListener = {
      start: jest.fn()
    }
    webhookSource.get = get
    triggerListenerFactory = {
      create: jest.fn(() => triggerListener)
    }
    manager = new WebhookContractManager(
      web3, '0x1234', fetch, webhookSource, new TriggerManager(triggerListenerFactory), logManager
    )
  })

  describe('start()', () => {
    it(
      'should setup the subscription and pull events',
      async () => {
        await manager.start()
        expect(contractGetPastEvents).toHaveBeenCalledTimes(1)

        expect(allEventsSubscription.on).toHaveBeenCalledWith(
          'data', expect.anything()
        )

        expect(allEventsSubscription.on).toHaveBeenCalledWith(
          'error', expect.anything()
        )

        expect(contractGetPastEvents).toHaveBeenCalledWith('allEvents', {
          fromBlock: 0,
          toBlock: 'latest'
        })

        expect(get).toHaveBeenCalledWith('asdf')

        expect(triggerListenerFactory.create).toHaveBeenCalledWith(webhook.ipfsHash, webhook.trigger)
      }
    )
  })
})
