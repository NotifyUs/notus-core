# notus-core

The Notus core allows developers to listen to Ethereum smart contract events or Graph Protocol subscriptions and trigger webhooks.  The core is agnostic of where webhooks are stored and how it's updated.  Notus Webhook storage is pluggable using connectors.  There is a Postgresql Connector and decentralized connectors using Ethereum smart contracts and IPFS.

## Postgresql Connector

## Decentralized Connector

Webhooks can be defined and registered by anyone in a [Notus smart contract](https://github.com/notifyus/notus-contracts).  The Notus node must be configured to point to the deployed smart contract.  When webhooks are deregistered from the smart contract the server stops listening to those events.

## Setup

We use [direnv](https://direnv.net/) to manage environment variables.  First set up your environment:

```bash
cp .envrc.example .envrc
direnv allow
```

Now make sure your dependencies are installed:

```bash
yarn
```
