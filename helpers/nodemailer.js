require('dotenv').config()
const { createTransport } = require('nodemailer')
const convertDate = require('./convertDate')

module.exports = (data) => {
  const {
    _id,
    user,
    startDate,
    endDate,
    unit,
    vendor,
    userProfile
  } = data

  const transporter = createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.NODEMAILER_GMAIL_USER,
      pass: process.env.NODEMAILER_GMAIL_PASS
    }
  })

  const userHTMLTemplate = (name) => {
    return `
      <div style="border: 1px solid black; padding: 20px 10px 20px 10px;">
        <p>Thank you <b>${name}</b> for using our services</p>
        <h3>Your order summary is down below</h3>
        <b>- Vendor Name:</b><br>
        ${vendor.firstName} ${vendor.lastName}
        <br><br>
        <b>- Vendor Email:</b><br>
        ${vendor.email}
        <br><br>
        <b>- Unit Name:</b><br>
        ${unit.name}
        <br><br>
        <b>- Unit Brand:</b><br>
        ${unit.brand}
        <br><br>
        <b>- Unit Year:</b><br>
        ${unit.year}
        <br><br>
        <b>- Booking Start Date:</b><br>
        ${convertDate(startDate)}
        <br><br>
        <b>- Booking End Date:</b><br>
        ${convertDate(endDate)}
        <br><br>
        <b>- Booking ID:</b><br>
        ${_id}
        <br><br>
        <h3>Sincerely, TraveRent.</h3>
        <img src="https://trave-rent-image-aws.s3-ap-southeast-1.amazonaws.com/Traverent_Square.png" />
      </div>
    `
  }
  const mailOptionsVendor = {
    from: '"TraveRent" <vehiclerentalh8@gmail.com>',
    to: vendor.email,
    subject: 'You have a new order',
    html: `
      <div style="border: 1px solid black; padding: 20px 10px 20px 10px;">
        <h3>Here is the order details</h3>
        <b>- Unit Name:</b><br>
        ${unit.name}
        <br><br>
        <b>- Unit Brand:</b><br>
        ${unit.brand}
        <br><br>
        <b>- Unit Year:</b><br>
        ${unit.year}
        <br><br>
        <b>- Customer Name:</b><br>
        ${userProfile.fullName}
        <br><br>
        <b>- Customer Phone Numbere:</b><br>
        ${userProfile.phoneNumber}
        <br><br>
        <b>- Customer Email:</b><br>
        ${userProfile.email}
        <br><br>
        <b>- Customer KTP Image:</b><br>
        <a href="${userProfile.imageKTP}">
          <img src="${userProfile.imageKTP}" style="width: 200px;" />
        </a>
        <br><br>
        <b>- Customer SIM Image:</b><br>
        <a href="${userProfile.imageSIM}">
          <img src="${userProfile.imageSIM}" style="width: 200px;" />
        </a>
        <br><br>
        <b>- Booking Start Date:</b><br>
        ${convertDate(startDate)}
        <br><br>
        <b>- Booking End Date:</b><br>
        ${convertDate(endDate)}
        <br><br>
        <b>- Booking ID:</b><br>
        ${_id}
        <br><br>
        <h3>Sincerely, TraveRent.</h3>
        <img src="https://trave-rent-image-aws.s3-ap-southeast-1.amazonaws.com/Traverent_Square.png" />
      </div>
    `
  }

  (mailOptionsVendor, '//as');

  const mailOptionsUser = {
    from: '"TraveRent" <vehiclerentalh8@gmail.com>',
    to: user.email,
    subject: 'Order Summary',
    html: userHTMLTemplate(`${user.firstName} ${user.lastName}`)
  }

  const mailOptionsUserProfile = {
    from: '"TraveRent" <vehiclerentalh8@gmail.com>',
    to: userProfile.email,
    subject: 'Order Summary',
    html: userHTMLTemplate(userProfile.fullName)
  }
  
  transporter.sendMail(mailOptionsVendor, function(err, info) {
    if(err)
      console.error('Error!' + err)
    else
      console.log('Email Sent to vendor')
  })

  transporter.sendMail(mailOptionsUser, function(err, info) {
    if(err)
      console.error('Error!' + err)
    else
      console.log('Email Sent to user')
  })

  transporter.sendMail(mailOptionsUserProfile, function(err, info) {
    if(err)
      console.error('Error!' + err)
    else
      console.log('Email Sent to user profile')
  })
}