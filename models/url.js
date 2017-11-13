var mongoose = require('mongoose');
var schema = mongoose.Schema;

var urlSchema = schema({
	_id: {type: Number, index: true},
	longUrl: String,
	createdAt: Date
});
var counterSchema = schema({
	_id: {type: String, required: true},
	seq: {type: Number, default: 0}
});
var counter = mongoose.model('counter', counterSchema);

urlSchema.pre('save', function (next) {
	var doc = this;
	counter.findByIdAndUpdate({_id: 'url_count'}, {$inc: {seq: 1}}, function (error, counter) {
		if (error) {
			return next(error);
		}
		doc._id = counter.seq;
		doc.createdAt = new Date();
		next();
	});
});

var Url = mongoose.model('Url', urlSchema);

module.exports = Url;
