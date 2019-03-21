# notus-node

The Notus node is a server that listens for Ethereum smart contract events or Graph Protocol subscriptions and triggers their corresponding webhooks.

## Decentralized Connectors

Webhooks can be defined and registered by anyone in a [Notus smart contract](https://github.com/notifyus/notus-contracts).  The Notus node must be configured to point to the deployed smart contract.  When webhooks are deregistered from the smart contract the server stops listening to those events.

## dependencies
- node >= 10
- yarn

## setup

We use [direnv](https://direnv.net/) to manage environment variables.  First set up your environment:

```bash
cp .envrc.example .envrc
direnv allow
```

Now make sure your dependencies are installed:

```bash
yarn
```

## run
```bash
yarn dev
```
