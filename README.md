# Frontend Bulk

Module for working with frontend bulk Zengine API requests and avoiding API 
rate limits.

## About

The methods included in this module are wrappers around the znData service,
which provides a convenient means of communication with the Zengine API.

For clarification on the znData service please refer to https://zenginehq.github.io/developers/plugins/api/services/

## Installation

```shell
npm install @zenginehq/frontend-bulk --save
```

## Usage

```shell
plugin.controller('Controller', ['$scope', 'wgnBulk', function ($scope, wgnBulk) {    
  $scope.deleteRecords = function deleteRecords(records) {
    var delay = 1500,
        params = {};
    
    params.formId = 12345;
    
    wgnBulk.deleteAll('FormRecords', params, records, delay)
      .then(function(response) {
        //do something with the response
      })
      .catch(function(err) {
        //handle the error
      })
  };

  $scope.getAllRecords = function getAllRecords() {
    var delay = 5000,
        params = {};

    params.formId = 12345;
    
    wgnBulk.getAll('FormRecords', params, delay)
      .then(function(response) {
        //do something with the response
      })
      .catch(function(err) {
        //handle the error
      })
  };

  $scope.updateRecords = function updateRecords(updates) {
    var delay = 10000,
        params = {};

    params.formId = 12345;

    wgnBulk.saveAll('FormRecords', params, updates, delay)
      .then(function(response) {
        //do something with the response
      })
      .catch(function(err) {
        //handle the error
      });
  };
}]);
```
