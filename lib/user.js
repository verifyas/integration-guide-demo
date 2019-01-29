class User {
  constructor() {
    this.currentBalance = 10000;
  }

  get balance() {
    return this.currentBalance;
  }

  storeTransferSession(session) {
    this.session = session;
  }

  isTransferSuccessful(transfer) {
    // this method is fake here. implement what is described below
    return true;

    // check that this transfer belongs to user
    // and transfer was processed successfuly
    return ((this.session.id === transfer.session_id) && (transfer.status === 'succeeded'));
  }

  updateBalance(transfer) {
    // implement what's needed for your service
    // update user balance
    this.currentBalance += transfer.amount;

    return true;
  }
}

module.exports = User
