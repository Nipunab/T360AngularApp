angular.module('siteApp').controller('LoginController', function ($scope, api, $rootScope, $location) {
    $scope.User = {
        Username: '',
        Password: ''
    };

    $rootScope.safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    $scope.login = function () {
        api.login($scope.User).then(function (loginResp) {
            if(loginResp.Status){
                //login sucess
                $rootScope.IsAuthenticated = true;
                api.getEmployee($scope.User.Username).then(function (myprofile) {
                    if(myprofile && myprofile.length > 0){
                        $rootScope.CurrentUser = myprofile[0];
                        if(myprofile[0].UserType.toUpperCase() === "ADMIN"){

                            $rootScope.safeApply(function () {
                                $location.path('/admin');
                            });
                        }else{
                            $rootScope.safeApply(function () {
                                $location.path('/home');
                            });
                        }
                    }else{
                      //user Details not available in DB
                    }
                });

            }else{
                $rootScope.CurrentUser = null;
                //login failed
            }
        });
    };

});