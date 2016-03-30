angular.module('siteApp').controller('HomePageController', function ($scope, $http, api) {

    $scope.message = 'This is Homepage screen';
    $scope.Employee = [];
    //getEmployee($http, $scope);
	$scope.safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };
    api.getEmployee().then(function(employee){ 
    	$scope.safeApply(function(){
    		$scope.Employee = employee;	
    	});
    	 
    });
});