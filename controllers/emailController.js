var nodemailer = require('nodemailer')
const User = require("../models/userModel");
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'eminentnewtonian@gmail.com',
        pass: 'mehs wtcx bwhg kbtx'
    }
})

exports.sendWelcome = async (email, name) => {

    var mail = {
        from:'CrowsKonnect admin@crowskonnect.com',
        to: email,
        subject:'Welcome',
        html: `<!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="X-UA-Compatible" content="ie=edge" />
            <style>
              *,
        *::before,
        *::before {
          margin: 0;
          padding: 0;
          box-sizing: inherit;
        }
        :root {
          --color-font: rgba(0, 0, 0, 0.8);
          --border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        html {
          font-size: 62.5%; /* 1rem = 10px */
        }
        
        @media (max-width: 1200px) {
          html {
            font-size: 56.25%; /* 1rem = 8px */
          }
        }
        @media (max-width: 900px) {
          html {
            font-size: 43.75%; /* 1rem = 7px */
          }
        }
        @media (max-width: 600px) {
          html {
            font-size: 43.75%; /* 1rem = 7px */
          }
        }
        body {
          box-sizing: border-box;
          line-height: 1.5;
        }
        .header {
          padding: 3rem 3rem;
        }
        .logo {
          padding-bottom: 3rem;
          border-bottom: var(--border-bottom);
        }
        .main {
          padding: 1rem 3rem;
        }
        .border {
          border-bottom: var(--border-bottom);
        }
        .headingContainer {
          display: flex;
          justify-content: space-between;
        }
        .headingContainer > .confetti {
          margin-right: 5rem;
        }
        .heading--primary {
          font-size: 4rem;
        }
        .heading--secondary {
          font-size: 2rem;
          text-transform: capitalize;
          margin-bottom: 2rem;
        }
        .paragraph {
          font-size: 1.5rem;
          margin-bottom: 2rem;
          color: var(--color-font);
        }
        .footer {
          text-align: center;
          padding: 2rem;
        }
        .footer__heading--secondary {
          font-size: 2rem;
          margin-bottom: 2rem;
        }
        .footer__heading--tertiary {
          font-size: 1.8rem;
          margin-bottom: 2rem;
        }
        a {
          font-size: 1.5rem;
          text-decoration: none;
          display: inline-block;
        }
        .margin-bottom {
          margin-bottom: 2rem;
        }
        .footer img {
          height: 4rem;
          width: 20rem;
        }
        .icon__container {
          font-size: 2rem;
        }
        .icon__container .fa {
          padding: 1rem;
        }
        .center-div{
            text-align: center;
        }
        .otpContainer {
          padding: 1.5rem 14rem;
          border: 1px solid #86efac;
          display: inline-block;
          border-radius: 5px;
          margin-top: 3rem;
          margin-bottom: 5rem;
          font-size: 2rem;
          font-weight: 600;
        }
        
            </style>
            <link
              rel="stylesheet"
              href="./font-awesome-4.7.0//css/font-awesome.min.css"
            />
            <title>Welcome</title>
          </head>
          <body>
            <main class="main">
              <div class="headingContainer">
                <h3 class="heading--primary">Welcome to Crowskonnect!</h3>
                <img src="./Assets/confetti (1) 1.png" alt="" class="confetti" />
              </div>
              <h3 class="heading--secondary">Hi, ${name}</h3>
              <p class="paragraph">
                We currently made Crowskonnect for moment like this, Welcome again to the
                Crowskonnect Crew and congratulations on being eligible to send and deliver orders!
              </p>
              <p class="paragraph">
                On Crowskonnect you get support when you need it from a community that truly
                cares. How you begin your crowskonnect journey is your choice! You can start
                by sending a good, or delivering a good. We
                cant wait to see which you will pick.
              </p>
              <p class="paragraph">
                At Crowskonnect, safety and transparency means everything to us. That's why
                we comit our time, resources to make sure that everyone in the crowskonnect
                community reflects the company's values, making ypur
                goods, data, and every sensitive information safe with us.
              </p>
              <p class="paragraph">
                Thank you for helping us grow our community. Let's make crowskonnect memories
                together!
              </p>
              <p class="paragraph">
                Thanks, <span style="display: block">Crowskonnect Team</span>
              </p>
              <div class="border"></div>
            </main>
            <footer class="footer">
              <h3 class="footer__heading--secondary">Want to reach out to us?</h3>
              <h3 class="footer__heading--tertiary">24/7 customer support</h3>
              <a href="www.crowskonnect.com" class="margin-bottom">www.crowskonnect.com</a>
              <p class="paragraph">Monday to Friday (9a.m - 5p.m)</p>
              <p class="paragraph">hello@crowskonnect.com</p>
              <p class="paragraph">
                Crowskonnect Inc, <br />
                Ilorin, Kwara, Nigeria
              </p>
              <div class="icon__container margin-bottom">
                <i class="fa fa-facebook-square"></i>
                <i class="fa fa-twitter-square"></i>
                <i class="fa fa-instagram"></i>
              </div>
              <p class="paragraph">
                We have sent you this email from Crowskonnect Inc. If you dont want to
                continue these emails or want to
                <strong>modify your subscription preference,</strong>
                <a href="#">click here</a>
              </p>
            </footer>
          </body>
        </html>
        `
    }
    transporter.sendMail(mail,(error,info)=>{
        if(error){
            console.log(error)
        }else{
            console.log(info.response)
        }
    })
}

exports.sendOtp = async (email, name, otp) => {
  
  var mail = {
    from:'CrowsKonnect admin@crowskonnect.com',
    to: email,
    subject:'Email Verification',
    html: `
    Dear ${name},
    <br/>
    Your Email Verification code is ${otp}
    `
}
transporter.sendMail(mail,(error,info)=>{
    if(error){
        console.log(error)
    }else{
        console.log(info.response)
    }
})
}