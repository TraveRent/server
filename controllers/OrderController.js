const { Order } = require('../models')

class OrderController {
  static async saveOrder(req, res, next) {
    try {
      const id = req.whoAmI._id
      console.log(req.body)
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
      res.status(201).json(createdOrder)
    } catch (error) {
      next(error)
    }
  }

  static async getOrder(req, res, next) {
    try {
      const allOrders = await Order.find({})
      .populate('vendor', '_id firstName lastName')
      .populate('user', '_id firstName lastName')
      .populate('unit', '_id name brand year')
      .populate('userProfile', '_id fullName phoneNumber email')
      res.status(200).json(allOrders)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = OrderController