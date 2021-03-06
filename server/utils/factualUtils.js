var Q = require('q');

var Factual = require('factual-api');
var factual = new Factual(process.env.WADDLE_FACTUAL_OAUTH_KEY, process.env.WADDLE_FACTUAL_OAUTH_SECRET);

var utils = {};

utils.getVenueInfo = function (factualID) {
  var deferred = Q.defer();

  factual.get('/t/places-us', {filters:{factual_id:{"$eq":factualID}}}, function (err, res) {
    if(err) {
			console.log(err);
			deferred.reject(err);
		} else {
			console.log(res.data);
			deferred.resolve(res.data);
		}
  });

  return deferred.promise;
};

utils.getMenu = function (factualID) {
	var deferred = Q.defer();

	  factual.get('/t/crosswalk?filters={"namespace":"allmenus", "factual_id":"' + factualID  + '"}', function (err, res) {
    if(err) {
			console.log(err);
			deferred.reject(err);
		} else {
			console.log(res.data);
			deferred.resolve(res.data);
		}
  });

	return deferred.promise;
}

utils.searchVenuesByGeolocation = function (latlng) {
	var deferred = Q.defer();
	console.log(latlng);

	factual.get('/t/places-us', {filters:{"category_ids":{"$includes_any":[308, 107]}}, geo:{"$circle":{"$center": latlng, "$meters": 25000}}, sort:{"distance": 100, "placerank": 10}}, function (err, res) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		} else {
			console.log(res.data);
			deferred.resolve(res.data);
		}
	});
	return deferred.promise;
}

utils.searchVenuesBySearchQueryAndGeolocation = function (latlng, query) {
	var deferred = Q.defer();
	factual.get('/t/places-us', {filters:{"name":{"$search": query}, "category_ids":{"$includes_any":[308, 107]}}, geo:{"$circle":{"$center": latlng, "$meters": 25000}}, sort:"$relevance"}, function (err, res) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		} else {
			console.log(res.data);
			deferred.resolve(res.data);
		}
	});
	return deferred.promise;
}

utils.searchVenuesByQueryAndNear = function (near, query) {
	var deferred = Q.defer();
	factual.get('/t/places-us', {filters:{"name":{"$search": query}, "$or": [{"locality": {"$search": near}}, {"region": {"$search": near}}], "category_ids":{"$includes_any":[308, 107]}}, sort:"$relevance"}, function (err, res) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		} else {
			console.log(res.data);
			deferred.resolve(res.data);
		}
	});
	return deferred.promise;
}

utils.getFactualIDFromFoursquareID = function (foursquareID) {
	console.log(foursquareID);
	var deferred = Q.defer();

	factual.get('/t/crosswalk?filters={"namespace":"foursquare", "namespace_id":"' + foursquareID  + '"}', function (err, res) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		} else {
			
		console.log(res.data);
  	deferred.resolve(res.data);
		}
  });

  return deferred.promise;
};

utils.findRestaurantsByCategoryAndLocationTerm = function () {


}

utils.getFoursquareIDFromFactualID = function (factualID) {
	console.log(factualID);
	var deferred = Q.defer();

	factual.get('/t/crosswalk?filters={"factual_id":"' + factualID + '", "namespace": "foursquare"}', function (err, res) {
		if(err) {
			console.log(err);
			deferred.reject(err);
		} else {
			console.log(res.data);
  	  deferred.resolve(res.data[0].namespace_id);
		}
  });

  return deferred.promise;
};

module.exports = utils;