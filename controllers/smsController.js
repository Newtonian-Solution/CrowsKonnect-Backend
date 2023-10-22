const { Vonage } = require('@vonage/server-sdk')

exports.sendSMS = async () => {
  const vonage = new Vonage({
    apiKey: "64b60987",
    apiSecret: "VwTDxZ20UJi7EWmf"
  });
  const from = "CrowsKonect"
  const to = '2348122647016'
  const text = `Hi Nurudeen,

  Your one-time password (OTP) for verifying the order is: 324983.
  
  Please use this OTP to confirm the order.
  
  Thank you,
  CrowsKonnect`
  try {
    const response = await vonage.sms.send({to, from, text})
    console.log(response);
  }catch(err) {
    console.log(err)
  }
}
