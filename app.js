const express = require('express');
const path = require('path');

const mongoose = require('mongoose');
const Book = require('./models/book');

const _ = require('underscore');

const port = process.env.PORT || 4000;
const app = express();

mongoose.connect('mongodb://localhost/book');

app.set('views', './views/pages');
app.set('view engine', 'jade');


//静态资源请求路径
app.use(express.static(path.join(__dirname, 'public')));

//表单提交 数据格式化
app.use(require('body-parser').urlencoded({
	extended: true
}));

app.locals.moment = require('moment')

app.listen(port);

console.log('server runing on http://127.0.0.1:' + port);


//index page
app.get('/', (req, res) => {

	Book.fetch((err, books) => {
		if (err) return console.error(err);

		res.render('index', {
			title: 'book 首页',
			books: books
		})
	})
})

//detail page
app.get('/book/:id', (req, res) => {
	let id = req.params.id

	Book.findById(id, (err, book) => {
		if (err) return console.error(err);

		res.render('detail', {
			title: '详情面 ' + book.name,
			book: book
		})

	})


})

//后台录入页
app.get('/admin/book', (req, res) => {

	res.render('admin_new', {
		title: 'book 后台录入页',
		book: {
			name: '',
			author: '',
			summary: '',
			poster: '',
		}
	})

})

// 后台更新页
app.get('/admin/update/:id', (req, res) => {
	//req.params.id获取:id的值
	let id = req.params.id
	if (id) {
		Book.findById(id, (err, book) => {
			res.render('admin_new', {
				title: 'book 后台更新',
				book: book
			})
		})
	}
})

//后台录入功能
app.post('/admin/book/new', (req, res) => {
	//用了bodyParser就可以采用这种req.body.movie获取前端页面传过来的值，以json格式包装
	let id = req.body.book._id;
	let bookObj = req.body.book;
	let _book;

	//如果id不存在，则判断为新增，反之则更新
	if (id == 'undefined') {
		_book = new Book({
			name: bookObj.name,
			author: bookObj.author,
			summary: bookObj.summary,
			poster: bookObj.poster,
		})

		_book.save((err, book) => {
			if (err) return console.error(err);

			// 更新成功后页面重定向到book详情页
			res.redirect('/admin/book/list')
		})
	} else {
		Book.findById(id, (err, book) => {
			if (err) return console.error(err);

			_book = _.extend(book, bookObj)
			_book.save((err, book) => {
				if (err) return console.error(err);

				// 更新成功后页面重定向到book详情页
				res.redirect('/admin/book/list')
			})
		})

	}


})

//后台删除功能
app.delete('/admin/book/delete', (req, res) => {
	//req.query.id获取请求值
	let id = req.query.id;

	if (id) {
		Book.remove({
			_id: id
		}, (err, book) => {
			if (err) return console.error(err);
			// res.redirect('/admin/book/list')
			res.json({
				success: 1
			})
		})
	}
})

//后台列表页
app.get('/admin/book/list', (req, res) => {

	Book.fetch((err, books) => {
		if (err) return console.error(err);

		res.render('admin_list', {
			title: '后台列表页',
			books: books
		})
	})

})