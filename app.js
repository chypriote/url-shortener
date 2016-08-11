var express = require('express');
var app = express();

var config = require('./config');
var base58 = require('./base58');
var url = require('./models/url');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var mongoose = require('mongoose');
mongoose.connect('mongodb://' + config.db.host + '/' + config.db.name);

var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/api/shorten', function (req, res) {
	var longUrl = req.body.url;
	var shortUrl = '';

	url.findOne({longUrl: longUrl}, function (err, doc) {
		if (doc) {
			shortUrl = config.webhost + base58.encode(doc._id);
			res.send({shortUrl: shortUrl});
		} else {
			var newUrl = url({longUrl: longUrl});

			newUrl.save(function (err) {
				if (err) {
					console.log(err);
				}

				shortUrl = config.webhost + base58.encode(newUrl._id);
				res.send({shortUrl: shortUrl});
			});
		}
	});
});

app.get('/:encodedId', function (req, res) {
	var base58Id = req.params.encodedId;
	var id = base58.decode(base58Id);

	url.findOne({_id: id}, function (err, doc) {
		if (doc) {
			res.redirect(doc.longUrl);
		} else {
			res.redirect(config.webhost);
		}
	});
});

app.listen(2005, function () {
	console.log('Server listening on port 2005');
});
