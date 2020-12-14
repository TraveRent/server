const { Unit } = require('../models')

module.exports = class UnitController {
  static async postAddVendorUnit(req, res, next) {
    try {
      const { name, brand, type, year, category, imageUrl } = req.body
      const { _id } = req.whoAmI
      const newUnit = new Unit({
        name: name,
        brand: brand,
        type: type,
        year: year,
        category: category,
        imageUrl: imageUrl,
        vendor: _id
      })

      const createdUnit = await newUnit.save()

      res.status(201).json(createdUnit)
    } catch (err) {
      next(err)
    }
  }

  static async getAllVendorUnit(req, res, next) {
    try {
      const { _id } = req.whoAmI
      const allUnits = await Unit.find({ vendor: _id }).populate('vendor')

      const results = []
      allUnits.forEach(unit => {
        unit.vendor = { _id: unit.vendor._id, email: unit.vendor.email }
        results.push(unit)
      })

      res.status(200).json(results)
    } catch (err) {
      next(err)
    }
  }

  static async getVendorUnitById(req, res, next) {
    try {
      const { unitId } = req.params

      const unit = await Unit.findById(unitId).populate('vendor')
      unit.vendor = { _id: unit.vendor._id, email: unit.vendor.email }
      res.status(200).json(unit)
    } catch (err) {
      next(err)
    }
  }

  static async putEditVendorUnitById(req, res, next) {
    try {
      const { unitId } = req.params
      const { name, brand, type, year, category, imageUrl } = req.body
      if(!name || !brand || !type || !year || !category || !category || !imageUrl)
        throw new Error('Please complete all forms')
        
      const unitAfter = {
        name: name,
        brand: brand,
        type: type,
        year: year,
        category: category,
        imageUrl: imageUrl
      }

      const { n } = await Unit.updateOne({ _id: unitId }, unitAfter, { upsert: false })
      if(n !== 1) throw new Error('Failed to edit data')
      res.status(200).json({ message: 'Successfully edit unit with id ' + unitId})
    } catch (err) {
      next(err)
    }
  }

  static async deleteVendorUnitById(req, res, next) {
    try {
      const { unitId } = req.params
      const { n } = await Unit.deleteOne({ _id: unitId })
      if(n !== 1) throw new Error('Failed to delete data')
      res.status(200).json({ message: 'Successfully delete unit with id ' + unitId})
    } catch (err) {
      next(err)
    }
  }
}
