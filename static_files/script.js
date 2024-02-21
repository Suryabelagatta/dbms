angular.module('loginApp', [])
.controller('loginController',  ['$scope', '$http', '$location', '$window', function($scope, $http, $location, $window){
    $scope.formData = {};
    $scope.message = '';

    $scope.submitForm = function() {
        $http.post('/validate', $scope.formData)
        .then(function(response) {
            if (response.data.valid) {
                $scope.message = 'Login successful';
                console.log(response.data.UserType)
                if(response.data.UserType=="Consumer"){
                    $window.location.href = '/consumer';
                }
            } else {
                $scope.message = 'Invalid username or password';
            }
        })
        .catch(function(error) {
            $scope.message = 'Error occurred while processing your request';
            console.error('Error:', error);
        });
    };
}]);

