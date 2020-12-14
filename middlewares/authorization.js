const { Unit } = require('../models')

module.exports = async (req, res, next) => {
  try {
    const { unitId } = req.params
    const { _id } = req.whoAmI
    const findUnit = await Unit.findById(unitId).populate('vendor')

    if(!findUnit) throw new Error('Unit not found')
    if(findUnit.vendor._id != _id) throw new Error('Unauthorized')
    next()
  } catch (err) {
    next(err)
  }
}
