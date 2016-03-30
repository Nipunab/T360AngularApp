angular.module('siteApp').directive('globalHeader', function ($rootScope, $location) {
    return {
        restrict: 'E',
        link: function ($scope, $el, attrs) {

        },
        controller: function ($scope, api) {
            $scope.IsAuthenticated = false;

            $scope.UserInfo = {};

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

            var lToken = getCookieVal('lToken');
            var uid = getCookieVal('uid');
            if (lToken && uid) {
                api.login().then(function (loginResp) {
                    if (loginResp.Status) {
                        $scope.safeApply(function () {
                            $scope.IsAuthenticated = true;
                        });
                        api.getEmployee(null,uid).then(function (myprofile) {
                            if(myprofile && myprofile.length > 0){
                                if(myprofile[0].UserType.toUpperCase() === "ADMIN"){
                                    $scope.safeApply(function () {
                                        console.log("Is Admin ");
                                        $scope.IsAdmin = true;
                                    });
                                    $rootScope.safeApply(function () {
                                        $rootScope.CurrentUser = myprofile[0];
                                        $location.path('/admin');
                                    });

                                }else{
                                    $rootScope.safeApply(function () {
                                        $rootScope.CurrentUser = myprofile[0];
                                        $location.path('/home');
                                    });
                                }
                            }else{
                                //user Details not available in DB
                            }
                        });
                    } else {
                        $scope.IsAuthenticated = false;
                        $rootScope.safeApply(function () {
                            $location.path('/login');

                        });
                    }
                });
            } else {
                $rootScope.safeApply(function () {
                    $location.path('/login');
                });
            }

            //listener on $rootScope event. event name is 'login-changed'
            $rootScope.$on('login-changed', function (er, rt) {
                $scope.IsAuthenticated = rt.IsAuthenticated;
                console.log("logged in changed ");
                uid = getCookieVal('uid');
                api.getEmployee(null,uid).then(function (myprofile) {
                    if(myprofile && myprofile.length > 0){
                        console.log('user type ', myprofile[0]);
                        

                        if(myprofile[0].UserType.toUpperCase() === "ADMIN"){
                            $scope.safeApply(function () {
                                console.log("Is Admin ");
                                $scope.IsAdmin = true;
                                $scope.UserInfo.FName = myprofile[0].FName;
                            });
                            $rootScope.safeApply(function () {
                                $rootScope.CurrentUser = myprofile[0];
                                $location.path('/admin');

                            });

                        }else{
                            $scope.safeApply(function () {
                                console.log("Is Admin ");
                                $scope.IsAdmin = false;
                                $scope.UserInfo.FName = myprofile[0].FName;
                            });
                            $rootScope.safeApply(function () {
                                $rootScope.CurrentUser = myprofile[0];
                                $location.path('/home');
                            });
                        }
                    }else{
                        //user Details not available in DB
                    }
                });
            });

            $scope.logout = function () {
                document.cookie = "lToken=TOKEN";
                document.cookie = "uid=USERID";
                document.cookie = "Username=USERNAME";
                $scope.IsAuthenticated = false;
                $rootScope.safeApply(function () {
                    $location.path('/login');
                });
            };

        },
        scope: {
            //IsAuthenticated: "="
        },
        replace: true,
        templateUrl: 'partials/header.html'
    };
});