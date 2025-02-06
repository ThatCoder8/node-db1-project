const db = require('../../data/db-config')

const checkAccountPayload = (req, res, next) => {
  const { name, budget } = req.body
  
  if (!name || budget === undefined) {
    res.status(400).json({ message: "name and budget are required" })
  } else if (name.trim().length < 3 || name.trim().length > 100) {
    res.status(400).json({ message: "name of account must be between 3 and 100" })
  } else if (budget === null || budget === '' || Array.isArray(budget) || typeof budget === 'boolean' || isNaN(Number(budget))) {
    res.status(400).json({ message: "budget of account must be a number" })
  } else if (Number(budget) < 0 || Number(budget) > 1000000) {
    res.status(400).json({ message: "budget of account is too large or too small" })
  } else {
    req.body.budget = Number(budget)
    req.body.name = name.trim()
    next()
  }
}
const checkAccountId = async (req, res, next) => {
  try {
    const account = await db('accounts').where('id', req.params.id).first()
    if (!account) {
      res.status(404).json({ message: "account not found" })
    } else {
      req.account = account
      next()
    }
  } catch (err) {
    next(err)
  }
}

const checkAccountNameUnique = async (req, res, next) => {
  try {
    const existing = await db('accounts')
      .where('name', req.body.name)
      .first()
    if (existing) {
      res.status(400).json({ message: "that name is taken" })
    } else {
      next()
    }
  } catch (err) {
    next(err)
  }
}

module.exports = {
  checkAccountPayload,
  checkAccountId,
  checkAccountNameUnique
}