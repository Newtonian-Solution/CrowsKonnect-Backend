var axios = require('axios');
var Order = require('./../models/orderModel')
var FormData = require('form-data');
exports.sendSMS = async (doc, name, pNo) => {
  var otpCode = '';
  var characters = '0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < 6; i++) {
    otpCode += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  await Order.findByIdAndUpdate(req.params.id, {"verifyCode": otpCode}, {
    new: true,
    runValidators: true
  });
  const text = `Hi ${doc.receiverName},

  The one-time password (OTP) to verify an order sent to you is: ${otpCode}.
  
  Please use this OTP to confirm the order.
  Do not disclose to anyone but the Delivery Man.
  
  Thank you,
  CrowsKonnect Team
  Sender: ${name} ${pNo}
  Delivery Man: ${doc.deliveryMan.firstname}`
  var data = new FormData();
  data.append('token', '44TIOwlHjVLTkaLZeXeJRfat7VnaBGaJldGt6Ex3mcmJ27JB3p');
  data.append('sender', 'Crowskonnet');
  data.append('to', doc.receiverNumber);
  data.append('message', text);
  data.append('type', '0');
  data.append('routing', '2');
  data.append('ref_id', 'crowskonnect'+ Date.now());

  try {
    var config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://app.smartsmssolutions.com/io/api/client/v1/sms/',
      headers: { 
        ...data.getHeaders()
      },
      data : data
    };
    
    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
  }catch(err) {
    console.log(err)
  }
}
