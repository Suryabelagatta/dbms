var app = angular.module('myApp', []);
app.config(['$locationProvider', function($locationProvider){
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
      })
    }])

app.controller('ProductController', ['$scope', '$http', '$location',function($scope, $http ,$location) {
    $scope.error = '';
    $scope.product = [];

    // Function to fetch product details
    const productId = $location.search().productId;
console.log(productId)
    $scope.fetchProductDetails = function(productId) {
        $http.get('/product/'+productId)
            .then(function(response) {
                console.log(response.data)
                $scope.product = response.data;
            })
            .catch(function(error) {
                $scope.error = 'Error fetching product details: ' + error.data.error;
            });
    };

    
}]);
