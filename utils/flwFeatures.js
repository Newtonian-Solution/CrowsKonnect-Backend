const AppError = require("./appError");
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);


exports.checkBVN = async (data) => {
  try {
    const payload = {
      "bvn": data
    }
    const response = await flw.Misc.bvn(payload)
    return response;
  } catch(err) {
      throw new Error(error);
  }
}

exports.getBanks = async () => {
  try {
      const payload = {      
        "country":"NG"  
      }
      const response = await flw.Bank.country(payload)
      return response;
  } catch (error) {
      throw new Error(error);
  }

}

exports.resolveAcct = async (data) => {
  try {
      const payload = {
          "account_number": data.account_number,
          "account_bank": data.account_bank
      }
      const response = await flw.Misc.verify_Account(payload)
      return response;
  } catch (error) {
      throw new Error(error);
  }
}

exports.verifyTrx = async (id) => {
  try {
      const payload = {"id": id}
      const response = await flw.Transaction.verify(payload)
      return response;
  } catch (error) {
      throw new Error(error);
  }
}

exports.initTransfer = async (data) => {
  try {
      const payload = {
          "account_bank": data.bank_id, 
          "account_number": data.account_number,
          "amount": data.amount,
          "narration": 'CrowsKonnect',
          "currency": "NGN",
          "reference": "crrowskonnect-"+Date.now(), //This is a merchant's unique reference for the transfer, it can be used to query for the status of the transfer
          "callback_url": "https://webhook.site/b3e505b0-fe02-430e-a538-22bbbce8ce0d",
          "debit_currency": "NGN"
      }
      const response = await flw.Transfer.initiate(payload)
      return response;
  } catch (error) {
      throw new Error(error);
  }
}

exports.createOTP = async () => {

  try {

      const payload = {
          "length": 7,
          "customer": { "name": "Nurudeen", "email": "ahmednurudeen06@gmail.com", "phone": "2348122647016" },
          "sender": "CrowsKonnect",
          "send": true,
          "medium": ["sms", "whatsapp"],
          "expiry": 5
      }

      const response = await flw.Misc.bal()
      console.log(response)
      return response;
  } catch (error) {
      console.log(error)
  }
}
