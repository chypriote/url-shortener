var MINI = require('minified');
var $ = MINI.$;

var clip = new Clipboard('.to-clipboard');

$('.btn-shorten').on('click', function (e) {
	e.preventDefault();
	$('#bottom-col').animate({$$fade: 0}, 500);
	console.log($('#bottom-col'));
	$.request('post', '/api/shorten', {url: $('#url-field').get('value')})
		.then(function success(data) {
			data = $.parseJSON(data);
			var result = data.shortUrl;
			$('#link').ht(result);
			$('#bottom-col').animate({$$fade: 1}, 500);
		});
	$('.to-clipboard').ht('Copier');
});

clip.on('success', function () {
	$('.to-clipboard').ht('Copié!');
});
