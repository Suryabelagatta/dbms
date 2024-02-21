angular.module('productApp', [])
.controller('productController', ['$scope', '$http', '$window', function($scope, $http, $window) {
    // Initialize an empty array to store products
    

    // Make an HTTP GET request to fetch product data from the API
    $http.get('/products')
        .then(function(response) {
            // // Success callback function
            $scope.products = response.data;
        })
        .catch(function(error) {
            // Error callback function
            console.error('Error fetching products:', error);
        });

    // Function to redirect to product details page
    $scope.redirectToDetails = function(productId) {
        // Redirect to details page with product ID
        $window.location.href = '/products/' + productId;
    };
}]);
