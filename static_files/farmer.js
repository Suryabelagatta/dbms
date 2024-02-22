const app=angular.module('farmerApp', []);
app.config(['$locationProvider', function($locationProvider){
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
      })
    }])
app.controller('farmerController', ['$scope', '$http','$location', function($scope, $http,$location) {
    // Initialize variable for products
     $scope.farmerProducts = [];

     const userId = $location.search().UserId;

    // Fetch farmer products
    fetchDataForFarmer(userId)
        .then(function(data) {
            $scope.farmerProducts = data;
        })
        .catch(function(error) {
            console.error('Error fetching data:', error);
        });

    // Function to fetch data for a farmer
    function fetchDataForFarmer(userId) {
        return $http.get('/farmer/' + userId)
            .then(function(response) {
                return response.data;
            })
            .catch(function(error) {
                throw new Error('Error fetching farmer data');
            });
    }
}]);
