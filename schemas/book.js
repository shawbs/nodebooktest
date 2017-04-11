const mongoose = require('mongoose')

const BookSchema = new mongoose.Schema({
	name: String,
	author: String,
	summary: String,
	poster: String,
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
})


//pre是每次调用save方法都执行这个方法体
BookSchema.pre('save', function(next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	} else {
		this.meta.updateAt = Date.now()
	}
	next()
})

//添加静态方法
BookSchema.statics = {
	fetch: function(cb) {
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)
	},
	findById: function(id, cb) {
		return this
			.findOne({
				_id: id
			})
			.exec(cb)
	}

}


//给其他地方调用提供了接口
module.exports = BookSchema