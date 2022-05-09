---
title: 'Track blockchain transactions with web3.js'
summary: Deep dive into transaction tracking with web3.js, examples of functions for ETH and ERC20 tokens.
author: Dmitry Semenovsky
cover: cover.jpg
category: Development
---

The number of dApps and tokens on the market is rapidly growing, with annual increases of over 1000 of new distributed applications, 500 new tokens, and online services built around both of these. There are a lot of fascinating features and benefits that blockchain technology brings into our lives. Nevertheless, the underlying idea is always the same; a transaction should be posted into a blockchain and mined in order to transfer crypto funds or execute any other function of a smart-contract.

For some applications and online services, it is crucial to know the current state of a user’s wallet or any transactions resulting from a user’s actions. There are a lot of web services that allow developers to get details about wallets and transactions via JSON API, such as BlockCypher. However, there were few, if any, places to see all the currencies and tokens needed in one place.

In this article, I will shed light on how do we deal with this at Pixel Point.

## Different projects — same tasks

Every blockchain uses different consensus protocols, but in terms of wallet and transaction watching, they all have a lot in common. Determining of the moment of funds transfer and verifying that the transaction has gained the number of confirmations needed for security reasons is a typical task for crypto projects.

Therefore, the task of crypto assets tracking can be split into two parts. First, watch the wallet for incoming transfers and get one that matches our filter criteria. Second, use the transaction hash of the transfer and watch for its confirmations.
Tracking ETH transactions

Let’s start from the currency of the Ethereum blockchain–Ether. Thanks to the efforts of the Ethereum development team and the open source community (which I count myself as part of), we have quite an impressive number of Web3 implementations:

- Python [Web3.py](https://github.com/ethereum/web3.py)
- Haskell [hs-web3](https://github.com/airalab/hs-web3)
- Java [web3j](https://github.com/web3j/web3j)
- Scala [web3j-scala](https://github.com/mslinn/web3j-scala)
- Purescript [purescript-web3](https://github.com/f-o-a-m/purescript-web3)
- PHP [web3.php](https://github.com/sc0Vu/web3.php)
- PHP [ethereum-php](https://github.com/digitaldonkey/ethereum-php)
- Swift [web3swift](https://github.com/BANKEX/web3swift)

However, the original and most popular one is JavaScript implementation, which is called web3.js. So let us use this powerful tool for working directly with Ethereum blockchain nodes and see how it works:

```bash
npm install web3
```

## ETH transactions subscriptions

Web3 API doesn’t allow you to subscribe directly to a wallet’s incoming transactions, so to solve our particular problem, we have to use a different strategy. First, we subscribe to all pending transactions, then we filter them by the sender’s wallet address and certain other criteria.

Web3.js allows us to talk directly to an Ethereum node via multiple protocols, including HTTP and WebSockets. For example, I use Rinkeby Testnet and nodes provided by [Infura](https://infura.io/). However, you a free to use any other provider, including local nodes.

In the function shown below, a new web3 instance with the WebSockets provider is created and used to establish a subscription to newly created transactions in blockchain. This instance is called pending.

A subscription object can be created using two methods, _subscribe()_ and _unsubscribe()_. Both of them accept a callback function to handle errors and any results of subscribing. There are two events that we can handle with subscriptions to pending transactions: _data_ and _error_. Certainly, _data_ is the essential event that we need for finding the transfer.

A data event handler only has one input parameter, which represents a transaction hash and checks every transaction for compliance with our search criteria when we need more details than just a hash. That’s where a different web3.js method, getTransaction(), can be used for reading transaction details. As this is an asynchronous call, I simply wrap it into a try-catch statement and await for the response. You can find the response object format in the official documentation for web3 [here](https://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransaction).

Once a response is received and the transaction matches our filter conditions, we need to initiate the transaction confirmation process and cancel the subscription by calling its unsubscribe() method. If we don’t have a transaction that satisfies our filter, we simply return from function to stay subscribed.

The function is shown below, but also you could get full workable [blockchain tracker example source code here.](https://github.com/pixel-point/web3js-tracker-example)

```javascript
function watchEtherTransfers() {
  // Instantiate web3 with WebSocket provider
  const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws'));

  // Instantiate subscription object
  const subscription = web3.eth.subscribe('pendingTransactions');

  // Subscribe to pending transactions
  subscription
    .subscribe((error, result) => {
      if (error) console.log(error);
    })
    .on('data', async (txHash) => {
      try {
        // Instantiate web3 with HttpProvider
        const web3Http = new Web3('https://rinkeby.infura.io/');

        // Get transaction details
        const trx = await web3Http.eth.getTransaction(txHash);

        const valid = validateTransaction(trx);
        // If transaction is not valid, simply return
        if (!valid) return;

        console.log(
          'Found incoming Ether transaction from ' +
            process.env.WALLET_FROM +
            ' to ' +
            process.env.WALLET_TO
        );
        console.log('Transaction value is: ' + process.env.AMOUNT);
        console.log('Transaction hash is: ' + txHash + '\n');

        // Initiate transaction confirmation
        confirmEtherTransaction(txHash);

        // Unsubscribe from pending transactions.
        subscription.unsubscribe();
      } catch (error) {
        console.log(error);
      }
    });
}
```

## ETH transactions confirmations counting

Once we determine which transaction we need to track, we can start monitoring the confirmations until they reach the needed amount.

There is a very simple way of determining a confirmations count basing on the block number in which a transaction was initially mined. The confirmations number is the difference between the current block number and the transaction block number. To get it, I suggest using a helper function which is outlined below.

```javascript
async function getConfirmations(txHash) {
  try {
    // Instantiate web3 with HttpProvider
    const web3 = new Web3('https://rinkeby.infura.io/');

    // Get transaction details
    const trx = await web3.eth.getTransaction(txHash);

    // Get current block number
    const currentBlock = await web3.eth.getBlockNumber();

    // When transaction is unconfirmed, its block number is null.
    // In this case we return 0 as number of confirmations
    return trx.blockNumber === null ? 0 : currentBlock - trx.blockNumber;
  } catch (error) {
    console.log(error);
  }
}
```

As the result of calling this function, we get an integer value that represents the confirmations count. Some projects require 100 confirmations, some fewer than 10, which is why we have to use this function recursively.

In the following example, I call getConfirmations() via the setTimeout() function, but you can implement it in other ways too.

I picked 10 as the default number of confirmations needed and set a 30 second interval, which is slightly more than Ethereum’s block mining time (10–19 seconds).

```javascript
function confirmEtherTransaction(txHash, confirmations = 10) {
  setTimeout(async () => {
    // Get current number of confirmations and compare it with sought-for value
    const trxConfirmations = await getConfirmations(txHash);

    console.log(
      'Transaction with hash ' + txHash + ' has ' + trxConfirmations + ' confirmation(s)'
    );

    if (trxConfirmations >= confirmations) {
      // Handle confirmation event according to your business logic

      console.log('Transaction with hash ' + txHash + ' has been successfully confirmed');

      return;
    }
    // Recursive call
    return confirmEtherTransaction(txHash, confirmations);
  }, 30 * 1000);
}
```

## Tracking ERC20 tokens

Knowing that ERC20 tokens are built on Ethereum as smart contracts, it may seem easy at first glance to track as Ether. Finding incoming transactions to a wallet with a certain crypto amount is different from Ether, because the transaction’s recipient address will always be a smart contract’s address. However, for each token transfer made, a special token contract’s function is called. This function calls Transfer events on blockchain when it succeeds and all events are logged by blockchain, becoming accessible at any time.

Our goal is to capture a transaction that meets the requirements the moment it gets posted to blockchain, so we are going to use the same WebSocketProvider. But, instead of subscription objects, we will instantiate token contract objects and listen for transfer events.

A token contract is needed to subscribe and parse event data, as row data is in hexadecimal format and is therefore not readable to humans. For instantiation of the contract object, we require a token’s JSON ABI (see example) and the Ethereum address the contract is deployed at.

The web3.js API allows us to filter events by indexed parameters of the event. In the case of a transfer event, such parameters are _\_from\*\*,_\_to*, and*\_value\*. While setting the options object for event subscriptions, we also can set the number of blocks to start looking for events.

As we filter transfer events, we will get the sought-for transaction once it appears on blockchain and we can then proceed to the confirmation stage.

```javascript
function watchTokenTransfers() {
  // Instantiate web3 with WebSocketProvider
  const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws'));

  // Instantiate token contract object with JSON ABI and address
  const tokenContract = new web3.eth.Contract(
    TOKEN_ABI,
    process.env.TOKEN_CONTRACT_ADDRESS,
    (error, result) => {
      if (error) console.log(error);
    }
  );

  // Generate filter options
  const options = {
    filter: {
      _from: process.env.WALLET_FROM,
      _to: process.env.WALLET_TO,
      _value: process.env.AMOUNT,
    },
    fromBlock: 'latest',
  };

  // Subscribe to Transfer events matching filter criteria
  tokenContract.events.Transfer(options, async (error, event) => {
    if (error) {
      console.log(error);
      return;
    }

    console.log(
      'Found incoming Pluton transaction from ' +
        process.env.WALLET_FROM +
        ' to ' +
        process.env.WALLET_TO +
        '\n'
    );
    console.log('Transaction value is: ' + process.env.AMOUNT);
    console.log('Transaction hash is: ' + txHash + '\n');

    // Initiate transaction confirmation
    confirmEtherTransaction(event.transactionHash);

    return;
  });
}
```

A transaction object of Ether transfer is subject to the same rules as a Transfer transaction, which means we can apply exactly the same _confirmEtherTransaction()_ function as we did with the Ether transaction in the above example.

## Final thoughts

These examples show how to specifically track ERC20 Token transfers, but the same technique can be applied to any other smart contract’s functions depending on your business needs. I have summed up the examples above in a simple node.js service, which can serve as a starting point to blockchain exploration.

We created a special repository with full working examples that describes all states from this article. Please feel free to use it in a draft for your next project:
