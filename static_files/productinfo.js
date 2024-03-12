var app = angular.module('myApp', []);
app.config(['$locationProvider', function($locationProvider){
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
}]);

app.controller('ProductController', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.product = null;
    $scope.order = {
        quantity: 0,
        totalAmount: 0,
        paymentMethod: '',
        transactionStatus: 'Success'
    };
    $scope.showBuyForm = false;

    // Function to fetch product details
    const productId = $location.search().productId;
    fetchProductDetails(productId);

    function fetchProductDetails(productId) {
        $http.get('/product/' + productId)
            .then(function(response) {
                $scope.product = response.data;
            })
            .catch(function(error) {
                console.error('Error fetching product details:', error);
            });
    }

    // Function to calculate total amount
    $scope.calculateTotal = function() {
        $scope.order.totalAmount = $scope.order.quantity * $scope.product.Price;
    };

    // Function to add product to cart
    $scope.buyed = function(product) {
        // Here you can implement the logic to send data to the server
        console.log('Order details:', $scope.order);
        // Example: You can call a service to send data to the server
        $http.post('/orders', $scope.order)
            .then(async function(response) {
                $scope.message = 'Order placed successfully';
                console.log('Order placed successfully', response.data);
                // You can add further actions here, like showing a success message
            })
            .catch(function(error) {
                console.error('Error placing order:', error);
                // Handle error, show error message, etc.
            });

        // Optionally, reset form fields or hide the form
        $scope.order = {
            quantity: 0,
            totalAmount: 0,
            paymentMethod: '',
            transactionStatus: 'Success'
        };
        $scope.showBuyForm = false;
    };
}]);
