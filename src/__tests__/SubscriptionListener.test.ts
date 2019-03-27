jest.mock('../getMainDefinition')
jest.mock('../apolloClientFactory')

import { SubscriptionListener } from '../SubscriptionListener'
import { LogManager } from '../LogManager'
import { graphWebhookFactory } from './support/graphWebhookFactory'

describe('SubscriptionListener', () => {
  const { subscribe, apolloClient, observable } = require('../apolloClientFactory')

  let callback, subscriptionListener, client

  beforeEach(() => {
    callback = jest.fn()
    let logManager = new LogManager()
    subscriptionListener = new SubscriptionListener(logManager)
  })

  describe('start()', () => {
    it('should work', () => {
      const webhook = graphWebhookFactory()

      subscriptionListener.start(webhook.ipfsHash, webhook.trigger, callback)

      expect(apolloClient.subscribe).toHaveBeenCalledTimes(1)
      expect(observable.subscribe).toHaveBeenCalledTimes(1)
    })
  })
})
