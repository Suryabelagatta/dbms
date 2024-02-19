angular.module('registerApp',[]);

angular.module('registerApp').controller('registerController', ['$scope', '$http', '$location', '$window', function($scope, $http, $location, $window) {
    $scope.formData = {};
    $scope.message = '';
    $scope.waitForTimer = function () {
        return new Promise(resolve => {
          setTimeout(() => {
            console.log('Timer is up!');
            resolve();
          }, 3000); // 5000 milliseconds = 5 seconds
        });
      };
    $scope.submitForm = function() {
        $http.post('/register', $scope.formData)
        .then(async function(response) {
            if (response.data.success) {
                $scope.message = 'Registration successful , you will be redirected to the login page';
                await $scope.waitForTimer();
                $window.location.href = '/';
            } else {
                $scope.message = 'Error registering user';
            }
        })
        .catch(function(error) {
            $scope.message = 'Error occurred while processing your request';
            console.error('Error:', error);
        });
    };
}]);