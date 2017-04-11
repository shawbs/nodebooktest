const mongoose = require('mongoose')
//获取模型
const BookSchema = require('../schemas/book')
//编译成模型
const Book = mongoose.model('Book', BookSchema)

//导出
module.exports = Book