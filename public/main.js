// YOUR_DOMAIN is here only for clarity. Because this demo
// works on the same domain it does not require domain in
// fetch method.
var YOUR_DOMAIN = "";
var successScreen = document.getElementById('successScreen');
var failureScreen = document.getElementById('failureScreen');
var transferScreen = document.getElementById('transferScreen');

var btn = document.getElementById('btnTopUp');

btn.addEventListener('click', function() { 
  createSession({ onSuccess: startTransfer });
  btn.disabled = true;
  btn.innerText = 'Please, wait...'
});

var btnTryAgain = document.getElementById('btnTryAgain');
btnTryAgain.addEventListener('click', tryAgain);

function createSession({ onSuccess }) {
  var amount = document.getElementById('amount').value;
  var data = { amount: amount, currency: 'BHD' };

  // call to your backend
  fetch(`${YOUR_DOMAIN}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(json => {
    onSuccess(json.sessionId);
  });
}

function startTransfer(sessionId) {
  const payment = new VerifyPayments({
    sessionId: sessionId,
    publicKey: 'pk_test_iHpU1X3UlhcdH2OWWajvfE30bTWbeQ1D',
    onComplete: function(result) {
      if (result.object === 'transfer') {
        finalizeTopUp(result.id);
      } else if (result.object === 'error') {
        document.getElementById('failureMessage').innerText = result.message;
        hide(transferScreen);
        show(failureScreen);
      }
    },
    onClose: function() {
    }
  });

  payment.show();
}

function finalizeTopUp(transferId) {
  fetch(`${YOUR_DOMAIN}/finalize-transfer/${transferId}`, {
    method: 'POST'
  })
    .then(response => response.json())
    .then(json => {
      if (json.status == 'success') {
        updateBalance(json.balance);
        hide(transferScreen);
        show(successScreen);
      } else {
        hide(transferScreen);
        show(failureScreen);
      }
    });
}

function updateBalance(amount) {
  // convert amount from units to whole value
  var currencyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'BHD' });
  var currencyOptions = currencyFormat.resolvedOptions();
  var formattedAmount = amount / Math.pow(10, currencyOptions.minimumFractionDigits);

  // update screen with new balance
  var balanceEl = document.getElementById('currentBalance');

  balanceEl.innerText = formattedAmount;
}

function hide(screen) {
  screen.style.display = 'none';
}

function show(screen) {
  screen.style.display = 'block';
}

function tryAgain() {
  console.log('try again');
  btn.disabled = false;
  btn.innerText = 'Top up via Bank Transfer';
  show(transferScreen);
  hide(successScreen);
  hide(failureScreen);
}
