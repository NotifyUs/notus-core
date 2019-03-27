import { TriggerListener } from "../TriggerListener";
import { webhookFactory } from "./support/webhookFactory";
import { LogManager } from '../LogManager'

describe("TriggerListener", () => {
  let subscription, fetch, web3, triggerListener, logManager, callback;

  beforeEach(() => {
    callback = jest.fn()
    subscription = {
      on: jest.fn(),
      unsubscribe: jest.fn()
    };
    fetch = jest.fn(() => Promise.resolve());
    web3 = {
      eth: {
        subscribe: () => subscription,
      },
    };
    logManager = new LogManager()
    triggerListener = new TriggerListener(web3, logManager);
  });

  describe("start()", () => {
    it("should attach all of the listeners", () => {
      const webhook = webhookFactory();
      triggerListener.start(webhook.ipfsHash, webhook.trigger, callback);
      expect(subscription.on).toHaveBeenCalledWith("data", expect.anything());
      expect(subscription.on).toHaveBeenCalledWith("error", expect.anything());
    });

    it("should not start again if already started", () => {
      let webhook = webhookFactory()
      triggerListener.start(webhook.ipfsHash, webhook.trigger, callback);
      expect(() => {
        triggerListener.start(webhook.ipfsHash, webhook.trigger, callback);
      }).toThrow();
    });
  });

  describe("stop()", () => {
    it('should stop a started subscription', () => {
      const webhook = webhookFactory()
      triggerListener.stop();
      triggerListener.start(webhook.ipfsHash, webhook.trigger, callback);
      triggerListener.stop();
      expect(subscription.unsubscribe).toHaveBeenCalledTimes(1)
    })
  });

  describe('onData', () => {
    it('should call the callback', () => {
      const webhook = webhookFactory()
      triggerListener.onData('1234', webhook, callback, { hello: 'test' })
      expect(callback).toHaveBeenCalledWith(null, { hello: 'test' })
    })
  })
});
