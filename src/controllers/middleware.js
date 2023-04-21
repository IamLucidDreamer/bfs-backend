const userModel = require('../models/user.js')
const { expressjwt: jwt } = require('express-jwt')
const { statusCode: SC } = require('../utils/statusCode')

const isSignedIn = jwt({
	secret: process.env.SECRET || 'dummy',
	algorithms: ['HS256', 'RS256'],
	userProperty: 'auth'
})

const isValidToken = (err, req, res, next) => {
	console.log(err);
	if (err.name === 'UnauthorizedError') {
		return res.status(SC.UNAUTHORIZED).json({ error: 'Authentication Failed!' })
	}
	next()
}

const isAuthenticated = (req, res, next) => {
	const checker = req.profile && req.auth && req.profile._id == req.auth._id
	if (!checker) {
		return res.status(SC.FORBIDDEN).json({
			error: 'ACCESS DENIED!'
		})
	}
	next()
}

const isAdmin = async (req, res, next) => {
	const authId = req.auth._id
	if (authId) {
		await userModel.findById(authId).then((user) => {
			if (!user) {
				return res.status(SC.NOT_FOUND).json({
					error: 'No user was found in DB or token is expired!'
				})
			}
			if (user.role === 2) {
				next()
			} else {
				res.status(SC.UNAUTHORIZED).json({
					error: 'Not an admin or token expired!'
				})
			}
		}).catch(err => res.status(SC.UNAUTHORIZED).json({
			error: 'Something Went Wrong',
			err: err
		}))
	}
}

module.exports = {
	isSignedIn,
	isValidToken,
	isAuthenticated,
	isAdmin
}
