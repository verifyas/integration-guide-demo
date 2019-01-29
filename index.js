const express = require('express')
const axios = require('axios')
const path = require('path')
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser')
const User = require('./lib/user')
const SDK = require('./lib/sdk')

const app = express()

// set Verify secret API key
const verifySDK = new SDK('sk_test_evhVQpR1uqbOYYLZdnVWr97chZ78Gf8p')

app
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())


app.post("/sessions", async (req, res, next) => {
  // you should load your current user from DB
  currentUser = new User();

  const amountInUnits = convertAmountToUnits(req.body.amount, req.body.currency)
  
  try {
    const session = await verifySDK.createSession({
      amountInUnits,
      currency: req.body.currency,
      description: 'Wallet topup'
    })
    currentUser.storeTransferSession(session);
    res.json({ sessionId: session.id });
  } catch (e) {
    next(e);
  }
})

app.post("/finalize-transfer/:transferId", async (req, res, next) => {
  try {
    const transfer = await verifySDK.getTransfer(req.params.transferId);
    
    if (transfer && currentUser.isTransferSuccessful(transfer)) {
        currentUser.updateBalance(transfer);
        res.json({ status: 'success', balance: currentUser.balance });
    } else {
        res.json({ status: 'failure' });
    }
  } catch (e) {
    next(e);
  }
})

function convertAmountToUnits(amount, currency) {
    const currencyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency });
    const currencyOptions = currencyFormat.resolvedOptions();
    return amount *= Math.pow(10, currencyOptions.minimumFractionDigits);
}

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
