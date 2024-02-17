// app.js
angular.module('registerApp', [])
.controller('registerController', function($scope, $http) {
    $scope.formData = {};
    $scope.message = '';

    $scope.submitForm = function() {
        $http.post('/register', $scope.formData)
        .then(function(response) {
            if (response.data.success) {
                $scope.message = 'Registration successful';
            } else {
                $scope.message = 'Error registering user';
            }
        })
        .catch(function(error) {
            $scope.message = 'Error occurred while processing your request';
            console.error('Error:', error);
        });
    };
});
