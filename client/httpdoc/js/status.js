/* global angular */

var api = angular.module('GithubApi', []);
api.controller('GithubStatus', function ($scope, $http) {
    function load() {
        $http.get('/status.json')
            .success(function (response) {
                $scope.status = response.status;
                $scope.updated = response.last_updated;
            });
        $http.get('/messages.json')
            .success(function (response) {
                $scope.messages = response;
            });
    }
    $scope.refresh = load;
    load();
});
