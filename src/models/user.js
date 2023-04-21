const mongoose = require('mongoose')
const crypto = require('crypto')
const { v1: uuidv1 } = require('uuid')

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			maxlength: 32,
			trim: true,
			required: true
		},
		gender: {
			type: String,
			enum: ['male', 'female'],
			// required: true
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true
		},
		countryCode: {
			type: Number,
			maxlength: 5,
			default: null,
			// required: true
		},
		// phoneNumber: {
		// 	type: Number,
		// 	maxlength: 15,
		// 	default: null,
		// 	 require: true
		// },
		encrypted_password: {
			type: String,
			required: true
		},
		salt: {
			type: String
		},
		role: {
			type: Number,
			default: 1
		}
	},
	{ timestamps: true }
)

userSchema
	.virtual('password')
	.set(function (password) {
		this._password = password
		this.salt = uuidv1()
		this.encrypted_password = this.securePassword(password)
	})

	.get(function () {
		return this._password
	})

userSchema.methods = {
	authenticate: function (password) {
		return this.securePassword(password) === this.encrypted_password
	},

	securePassword: function (password) {
		if (!password) return ''

		try {
			return crypto
				.createHmac('sha256', this.salt)
				.update(password)
				.digest('hex')
		} catch (err) {
			return ''
		}
	}
}

module.exports = mongoose.model('users', userSchema, 'users')
