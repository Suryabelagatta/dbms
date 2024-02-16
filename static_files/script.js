angular.module('loginApp', [])
.controller('loginController', function($scope, $http) {
    $scope.formData = {};
    $scope.message = '';

    $scope.submitForm = function() {
        $http.post('/validate', $scope.formData)
        .then(function(response) {
            if (response.data.valid) {
                $scope.message = 'Login successful';
            } else {
                $scope.message = 'Invalid username or password';
            }
        })
        .catch(function(error) {
            $scope.message = 'Error occurred while processing your request';
            console.error('Error:', error);
        });
    };
});

