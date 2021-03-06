const { Order } = require('../models')
const { sendEmail } = require('../helpers')

class OrderController {
  static async saveOrder(req, res, next) {
    try {
      const id = req.whoAmI._id
      const { unitId, vendorId, startDate, endDate, profileId } = req.body
      const newOrder = new Order({
        user: id,
        startDate: startDate,
        endDate: endDate,
        unit: unitId,
        vendor: vendorId,
        userProfile: profileId
      })
      const createdOrder = await newOrder.save()
      // * If reach this line, it means the order has been successfully saved into db
      sendEmail(
        await Order.findById(createdOrder._id)
        .populate('vendor', '_id firstName lastName email')
        .populate('user', '_id firstName lastName email')
        .populate('unit', '_id name brand year price')
        .populate('userProfile', '_id fullName phoneNumber email imageKTP imageSIM')
      )
      res.status(201).json(createdOrder)
    } catch (error) {
      next(error)
    }
  }

  static async getOrder(req, res, next) {
    const allOrders = await Order.find({})
      .populate('vendor', '_id firstName lastName')
      .populate('user', '_id firstName lastName')
      .populate('unit', '_id name brand year')
      .populate('userProfile', '_id fullName phoneNumber email')
    res.status(200).json(allOrders)
    // ! Coverage
    // try {
    //   const allOrders = await Order.find({})
    //   .populate('vendor', '_id firstName lastName')
    //   .populate('user', '_id firstName lastName')
    //   .populate('unit', '_id name brand year')
    //   .populate('userProfile', '_id fullName phoneNumber email')
    //   res.status(200).json(allOrders)
    // } catch (error) {
    //   next(error)
    // }
  }
}

module.exports = OrderController