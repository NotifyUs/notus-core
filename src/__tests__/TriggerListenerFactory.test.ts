import { TriggerListenerFactory } from '../TriggerListenerFactory'
import { LogManager } from '../LogManager'
import { webhookFactory } from './support/webhookFactory'
import { graphWebhookFactory } from './support/graphWebhookFactory'

jest.mock('../TriggerListener')
jest.mock('../SubscriptionListener')

describe('TriggerListenerFactory', () => {
  let webhookListenerFactory,
      web3,
      logManager

  beforeEach(() => {
    web3 = 'asdf'
    logManager = new LogManager()
    webhookListenerFactory = new TriggerListenerFactory(web3, logManager)
  })

  it('should build an EventTrigger', () => {
    let webhook = webhookFactory()
    webhookListenerFactory.create(webhook.ipfsHash, webhook.trigger)
  })

  it('should build a GraphTrigger', () => {
    let webhook = graphWebhookFactory()
    webhookListenerFactory.create(webhook.ipfsHash, webhook.trigger)
  })
})
