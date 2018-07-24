plugin.service('wgnBulk', ['$timeout', 'znData', function($timeout, znData) {
  /**
    * Creates a serialized id.
    *
    * @private
    * @param {Array<Object>} collection An array of resources.
    * @param collection.id The individual resource's unique identifier.
    *
    * @return {string} The serialized ids.
    */
  var _serialize = function _serialize(collection) {
    var serial = '';

    for (var index = 0; index < collection.length; index++) {
      if (index !== collection.length - 1) {
        serial = serial.concat(collection[index].id, '|');
      } else {
        serial = serial.concat(collection[index].id);
      }
    }

    return serial;
  };

  /**
    * Wraps a delay around the znData request.
    *
    * @private
    * @param {Function<Promise>} operation The request to be wrapped.
    * @param {number} delay The delay, in milliseconds, to wrap around the
    *   request.
    *
    * @return {Function} A promise with a delayed resolution.
    */
  var _slow = function slow(operation, delay) {
    return function(params, options) {
      return $timeout(function() {
        return operation(params, options);
      }, delay);
    };
  };

  /**
    * Deletes resources.
    *
    * @param {string} endpoint The Zengine API endpoint to query.
    * @param {Object} params The request details.
    * @param {Array<Object>} resources The resources to be deleted.
    * @param {number} delay The desired delay, in milliseconds; optional.
    *
    * @return {Promise} The completed request.
    */
  this.deleteAll = function deleteAll(endpoint, params, resources, delay) {
    var request = znData(endpoint).deleteAll;

    request = delay ? _slow(request, delay) : request;

    function deleteSome() {
      var _params = angular.copy(params);

      _params.id = _serialize(resources.splice(0, 300));

      return request(_params)
      .then(function() {
        return resources.length ? deleteSome() : 'Deletion complete.';
      });
    }

    return deleteSome();
  };

  /**
    * Gets resources.
    *
    * @param {string} endpoint The Zengine API endpoint to query.
    * @param {Object} params The details of the request.
    * @param {number} delay The desired delay, in milliseconds; optional.
    *
    * @return {Promise} The completed request.
    */
  this.getAll = function getAll(endpoint, params, delay) {
    var collection = [],
        done = false,
        request = znData(endpoint).get;

    params.limit = params.limit || 1000;
    params.page = params.page || 1;

    request = delay ? _slow(request, delay) : request;

    function getSome() {
      return request(params, function(results, meta) {
        if (meta.totalCount !== 0) {
          collection = collection.concat(results);
          params.page++;
        } else {
          done = true;
        }
      })
      .then(function(response) {
        return done ? collection : getSome();
      });
    }

    return getSome();
  };

  /**
    * Creates resources or updates existing resources.
    *
    * @param {string} endpoint The Zengine API endpoint to query.
    * @param {Object} params The request details.
    * @param {number} delay The desired delay, in milliseconds; optional.
    *
    * @return {Promise} The completed request.
    */
  this.saveAll = function saveAll(endpoint, params, updates, delay) {
    var confirmations = [],
        request = znData(endpoint).saveAll;

    request = delay ? _slow(request, delay) : request;

    function saveSome() {
      var _updates = updates.splice ? updates.splice(0, 500) : updates;

      return request(params, _updates)
      .then(function(response) {
        confirmations = confirmations.concat(response);
        return updates.length ? saveSome() : confirmations;
      });
    }

    return saveSome();
  };

}]);
