(function($) {

	$('[data-name="remove"]').on('click', (e) => {

		if (confirm('确定删除吗？')) {

			var _target = $(e.target),
				_id = _target.data('id'),
				_tr = $('.item-id-' + _id);

			$.ajax({
				type: 'DELETE',
				url: '/admin/book/delete?id=' + _id
			}).done((res) => {
				console.log(res)
				if (res.success === 1) {
					if (_tr.length > 0) {
						_tr.remove();
					}
				}
			})
		}

	})

	//prototype
	if (typeof String.prototype.strtrim == 'undefined') {
		String.prototype.strtrim = function(start, size, str) {
			return this.length > Number(size) ? this.substr(start, size) + str : this
		}
	}



})(jQuery)