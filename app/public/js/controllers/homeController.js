angular.module("tinyurlApp")
    .controller("homeController", ["$scope", "$http", "$location", function ($scope, $http, $location) { // $location is provided by ngRoute
        $scope.submit = function () {
            // post request
            $http.post("/api/v1/urls", { // asynchronous I/O
                longUrl: $scope.longUrl
            }).success(function (data) {
                console.log("success");
                $location.path("/urls/" + data.shortUrl);
            });
        }
    }]);