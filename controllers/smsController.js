var axios = require('axios');
var FormData = require('form-data');
exports.sendSMS = async () => {
  const text = `Hi Nurudeen,

  Your one-time password (OTP) for verifying the order is: 324983.
  
  Please use this OTP to confirm the order.
  
  Thank you,
  CrowsKonnect Team
  Sender: Jubril Lukman
  Delivery Person: Kunle`
  var data = new FormData();
  data.append('token', '44TIOwlHjVLTkaLZeXeJRfat7VnaBGaJldGt6Ex3mcmJ27JB3p');
  data.append('sender', 'Crowskonnet');
  data.append('to', '08139148223');
  data.append('message', text);
  data.append('type', '0');
  data.append('routing', '2');
  data.append('ref_id', 'uniqu56-ref-id');

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
