import { IPFSWebhookSource } from '../IPFSWebhookSource'

describe('IPFSWebhookSource', () => {
  const validWebhook = {
    url: 'webhookUrl',
    query: {
      queryType: 'EventQuery',
      address: 'addy',
      topics: ['1']
    }
  }

  const invalidWebhook = {
    foo: 'bar'
  }

  it('should retrieve from IPFS and validate and contruct', async () => {
    let ipfs = {
      get: jest.fn(() => [{ path: 'path', content: JSON.stringify(validWebhook) }])
    }
    let webhookSource = new IPFSWebhookSource(ipfs)
    var webhook = await webhookSource.get('ipfsHash')
    expect(webhook.url).toEqual('webhookUrl')
    expect(ipfs.get).toHaveBeenCalledWith('ipfsHash')
  })

  it('should throw on an invalid webhook', async () => {
    let ipfs = {
      get: jest.fn(() => JSON.stringify(invalidWebhook))
    }
    let webhookSource = new IPFSWebhookSource(ipfs)

    let errorThrown = false
    try {
      await webhookSource.get('ipfsHash')
    } catch (error) {
      errorThrown = true
    }

    expect(errorThrown).toBeTruthy()
  })
})
