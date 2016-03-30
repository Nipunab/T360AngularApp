angular.module('siteApp').directive('sideNav', function ($http, $location, api) {
    return {
        restrict: 'E',
        controller:function($scope){
            $scope.Projects = [];

            //getProjects($http, $scope);

            api.getProjects().then(function (projects) {
                $scope.Projects = projects;
            });

            $scope.IsProjectVisible = false;
            $scope.ShowProjectList = function () {
                $scope.IsProjectVisible = $scope.IsProjectVisible ? false : true;
            };


             $scope.Practise = [];


            //getPractise($http, $scope);
            api.getPractise().then(function (practise) {
                $scope.Practise = practise;
            });



            $scope.IsPractiseVisible = false;
             $scope.ShowCOEList = function () {
                 $scope.IsPractiseVisible = $scope.IsPractiseVisible ? false : true;
             };

            // $scope.Trainings = [];
            //
            //getTrainings($http, $scope);
            //$scope.IsTrainingVisible = false;
            //$scope.ShowTrainingList = function () {
            //     $scope.IsTrainingVisible = $scope.IsTrainingVisible ? false : true;
            // };

            $scope.navigateToPage = function (toPage, pageType) {
                switch (pageType){
                    case 'PROJECT':
                        $location.path('/projects/' + toPage);
                        break;
                     case 'COE':
                      $location.path('/coe/' + toPage);
                        break;
                    case 'TRAININGS':
                         $location.path('/trainings/'+toPage);
                        break;
                }
            }

        },
        scope: {
            pageType: '@'
        },
        link: function (scope, element, attrs) {
            //scope.pageType = attrs.pageType;
        },
        replace: true,
        templateUrl: 'partials/sidenav.html'
    };
});