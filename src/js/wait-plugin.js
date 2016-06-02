var q = require('q');

var deferred = q.defer();

exports.resolve = function () {
	setTimeout(function () {
		deferred.resolve.apply(deferred, arguments);
	}, 1000);
};

exports.teardown = function () {
	console.log('waitplugin.teardown');
	return deferred.promise;
};
