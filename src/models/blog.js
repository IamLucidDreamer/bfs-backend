const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')
const userSchema = require("./user")

const blogSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.ObjectId,
			required: true,
			ref: userSchema
		},
		title: {
			type: String,
			required: true,
			trim: true
		},
		description: {
			type: String,
			required: true,
			trim: true
		},
		imageMain: {
			type: String
		},
		imageSecondary: {
			type: String
		},
		tag: {
			type: String
		},
	},
	{ timestamps: true }
)

blogSchema.plugin(mongoosePaginate)

module.exports = mongoose.model('blog', blogSchema, 'blog')
