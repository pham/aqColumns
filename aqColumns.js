(function($) {
$.fn.aqColumns = function($o) {
	var _o = $.extend({
		colSize: 266,
		margin: 10,
		columns: 0,
		pointer: 0
	}, $o);

	var _handler = function($ob) {
		var _tmr = null;
		$(window).resize(function() {
			if (_tmr) {
				clearTimeout(_tmr);
			}
			_tmr = setTimeout(function() {
				_calculate($ob);
			},500);
		});
	};

	var _draw = function($ob) {
		var _spread = $('.aqColumns', $ob)
			.empty()
			.width(_o.columns * _o.colSize + ((_o.columns - 1) * _o.margin)),
			_i = 0;

		for (_i; _i < _o.columns; _i++) {
			$('<div class="aqColumn aqColumn_' + _i + '"\/>')
				.css({
					float: 'left',
					width: _o.colSize,
					marginLeft: _i === 0 ? 0 : _o.margin
				})
				.appendTo(_spread);
		}

		$('<br>')
			.css({float: 'none', clear: 'both'})
			.appendTo(_spread);
	};

	var _calculate = function($ob) {
		var _col = Math.floor($($ob).outerWidth(true) /
			(_o.colSize + _o.margin));

		if (_o.mobile) {
			_o.colSize = $('body').width() - _o.margin;
			_col = 1;
		} else if (_o.staticColumns) {
			_col = _o.staticColumns;
		}

		if (_col && _col !== _o.columns) {
			_o.columns = _col;

			_draw($ob);

			if ($.isFunction(_o.preload)) {
				_o.preload($ob);
			}

			if ($.isFunction(_o.callback)) {
				_o.callback($ob);
			}

			if ($.isFunction(_o.postload)) {
				_o.postload($ob);
			}
		}
	};

	return this.each(function() {
		$('<div class="aqColumns"\/>')
			.css({ marginLeft: 'auto', marginRight: 'auto' })
			.appendTo(this);

		this.index = function($idx) {
			return $('.aqColumns > div:nth-child(' +
				((($idx || ++_o.pointer) - 1) % _o.columns + 1) +
			')', this);
		};

		this.shortest = function() {
			var _c = 1, _m = 0, _i = 0;
			for (_i; _i < _o.columns; _i++) {
				var _h = $('.aqColumns', this)
					.find('> div:nth-child(' + (_i + 1) + ')')
					.outerHeight(true);

				if (!_h) {
					_c = _i + 1;
					break;
				}

				if (_h <= _m) {
					_c = _i + 1;
					_m = _h;
				} else if (!_m) {
					_m = _h;
				}
			}

			_o.pointer = _c - 1;
			return $('.aqColumns > div:nth-child(' + _c + ')', this);
		};

		_calculate(this);
		_handler(this);

		return true;
	});
};
}(jQuery));
