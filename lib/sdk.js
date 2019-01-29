const axios = require('axios')

class SDK {
  constructor(secretApiKey) {
    this.client = axios.create({
      baseURL: 'https://api.verifypayments.com',
      headers: { 'Content-Type': 'application/json' }
    });
    this.client.defaults.headers.common['Authorization'] = 'Bearer ' + secretApiKey;
  }

  async getTransfer(transferId) {
    return this.client.get(`/transfers/${transferId}`).then((response) => { return response.data });
  }

  async createSession({ amountInUnits, currency, description }) {
    return this.client.post('/sessions', {
        amount: amountInUnits,
        currency: currency,
        description: description
    })
    .then((response) => { return response.data });
  }
}

module.exports = SDK

