angular.module('loginApp', [])
.controller('loginController',  ['$scope', '$http', '$location', '$window', function($scope, $http, $location, $window){
    $scope.formData = {};
    $scope.message = '';

    $scope.submitForm = function() {
        $http.post('/validate', $scope.formData)
        .then(function(response) {
            console.log(response.data);
            if (response.data.valid) {
                $scope.message = 'Login successful';

                if(response.data.UserType=="Consumer"){
                    $window.location.href = '/consumer';
                }else{                    
                    var url = '/farmer.html?UserId=' + encodeURIComponent(response.data.UserId);

                    $window.location.href = url;                    
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

