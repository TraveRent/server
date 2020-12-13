const { Unit } = require('../models')

module.exports = class UnitController {
  static async postAddVendorUnit(req, res, next) {
    try {
      const { name, brand, type, year, category, imageUrl } = req.body
      const newUnit = new Unit({
        name: name,
        brand: brand,
        type: type,
        year: year,
        category: category,
        imageUrl: imageUrl
      })

      const createdUnit = await newUnit.save()

      res.status(201).json(createdUnit)
    } catch (err) {
      next(err)
    }
  }

  static async getAllUnit(req, res, next) {
    try {
      const allUnit = await Unit.find({})
      res.status(200).json(allUnit)
    } catch (error) {
      next(error)
    }
  }

  static async editUnitById(req, res, next) {
    try {
      const id = req.params.id
      const { name, brand, type, year, category, imageUrl } = req.body
      const newUnit = new Unit({
        name: name,
        brand: brand,
        type: type,
        year: year,
        category: category,
        imageUrl: imageUrl
      })

      const updatedUnit = await Unit.findByIdAndUpdate(id, newUnit, { returnOriginal: false })
      res.status(200).json(updatedUnit)
    } catch (error) {
      next(error)
    }
  }

  static async deleteUnitById(req, res, next) {
    try {
      const id = req.params.id
      const deletedUnit = await Unit.findByIdAndDelete(id)
      res.status(200).json(deletedUnit)
    } catch (error) {
      next(error)
    }
  }
}
