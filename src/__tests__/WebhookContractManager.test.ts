import { WebhookContractManager } from '../WebhookContractManager'
import { IPFSWebhookSource } from '../IPFSWebhookSource'
import { WebhookManager } from '../WebhookManager'
import * as utils from 'web3-utils'

jest.mock('../eventProjection')

describe('WebhookContractManager', () => {
  let web3,
      subscribe,
      get,
      manager,
      webhookListenerFactory,
      contractAllEvents,
      allEventsSubscription,
      contractGetPastEvents

  beforeEach(() => {
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
    get = jest.fn(() => Promise.resolve('webhook'))
    web3 = {
      utils: {
        sha3: utils.sha3
      },
      eth: {
        Contract
      }
    }
    let webhookSource = new IPFSWebhookSource('ipfs')
    webhookSource.get = get
    webhookListenerFactory = {
      create: jest.fn(() => 'webhookListener')
    }
    manager = new WebhookContractManager(
      web3, '0x1234', webhookSource, new WebhookManager(webhookListenerFactory)
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

        expect(webhookListenerFactory.create).toHaveBeenCalledWith('webhook')
      }
    )
  })
})
