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
     $scope.showForm = false;
     $scope.successMessage = '';
 
     // Toggle visibility of the add product form
     $scope.showAddProductForm = function() {
         $scope.showForm = !$scope.showForm;
         $scope.successMessage = ''; // Clear success message
     };
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

    // Function to add a new product
    $scope.addProduct = function () {
        if($scope.farmerProducts[0].ProductName==null){
            var id=(userId * 10);
        }else{
            var id=(userId * 10 + $scope.farmerProducts.length);
        }
        var newProduct = {
            farmerid: userId,
            productid: id, // Unique productid calculation
            name: $scope.newProduct.name,
            description: $scope.newProduct.description,
            price: $scope.newProduct.price,
            quantity: $scope.newProduct.quantity,
            image: $scope.newProduct.image
        };

        $http.post('/add-product', newProduct)
        .then(function (response) {
            // Clear the form fields after successful addition
            $scope.successMessage = 'Product added successfully!';
            $scope.newProduct = {};
            // Refresh the products list to display the new product
            fetchDataForFarmer(userId)
                .then(function (data) {
                    $scope.farmerProducts = data;
                })
                .catch(function (error) {
                    console.error('Error fetching data:', error);
                });
        })
        .catch(function (error) {
            console.error('Error adding product:', error);
        });
    };



}]);